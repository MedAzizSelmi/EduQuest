from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from langchain_ollama import OllamaLLM
from langchain.prompts import ChatPromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_community.callbacks.manager import get_openai_callback
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import os
import time
import json
import logging
import uuid
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler()])
logger = logging.getLogger("chatbot-api")

# Create FastAPI app
app = FastAPI(
    title="Enhanced Chatbot API",
    description="A robust API for context-aware chatbot interactions",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request/response models
class ChatRequest(BaseModel):
    context: str = Field(..., description="The context information for the chatbot")
    question: str = Field(..., description="The user's question")
    conversation_id: Optional[str] = Field(None, description="Conversation ID for maintaining context")
    max_tokens: Optional[int] = Field(2048, description="Maximum tokens for response")
    temperature: Optional[float] = Field(0.7, description="Temperature for response generation")
    system_prompt: Optional[str] = Field(None, description="Optional system prompt override")

class ChatResponse(BaseModel):
    answer: str
    conversation_id: str
    tokens_used: int
    processing_time: float

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str

# In-memory conversation storage (use a database in production)
conversation_store = {}

# System prompt template
DEFAULT_SYSTEM_PROMPT = """You are a helpful assistant that answers questions based on the provided context.
If the information isn't available in the context, say "I don't know" rather than making up an answer.
Provide concise, accurate responses that directly address the question."""

# Initialize the LLM and embeddings model
@app.on_event("startup")
async def startup_event():
    logger.info("Initializing API and models...")
    app.state.llm = OllamaLLM(
        model="llama3",
        temperature=0.7,
        top_p=0.9,
        repeat_penalty=1.1
    )
    app.state.embeddings = FastEmbedEmbeddings()
    logger.info("API initialization complete")

# Create the chat chain based on context
def create_chat_chain(context, system_prompt=None, temperature=0.7):
    # Split the context into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    texts = text_splitter.split_text(context)
    
    # Create vector store
    vectorstore = FAISS.from_texts(texts, app.state.embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    
    # Set up memory
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True
    )
    
    # Create QA chain
    system_prompt = system_prompt or DEFAULT_SYSTEM_PROMPT
    
    template = f"""
    {system_prompt}
    
    Context:
    {{context}}
    
    Question: {{question}}
    
    Answer:
    """
    
    prompt = ChatPromptTemplate.from_template(template)
    
    # Create model with adjusted temperature
    model = OllamaLLM(
        model="llama3",
        temperature=temperature
    )
    
    chain = ConversationalRetrievalChain.from_llm(
        llm=model,
        retriever=retriever,
        memory=memory,
        verbose=True
    )
    
    return chain

# Health check endpoint
@app.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# Main chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    start_time = time.time()
    tokens_used = 0
    
    try:
        # Generate or retrieve conversation ID
        conversation_id = request.conversation_id or str(uuid.uuid4())
        
        # Get or create conversation chain
        if conversation_id not in conversation_store:
            logger.info(f"Creating new conversation: {conversation_id}")
            chain = create_chat_chain(
                request.context, 
                system_prompt=request.system_prompt,
                temperature=request.temperature
            )
            conversation_store[conversation_id] = chain
        else:
            logger.info(f"Using existing conversation: {conversation_id}")
            chain = conversation_store[conversation_id]
        
        # Measure token usage
        with get_openai_callback() as cb:
            result = chain.invoke({
                "question": request.question
            })
            tokens_used = cb.total_tokens
        
        # Extract answer from result
        answer = result.get("answer", str(result))
        
        # Clean up old conversations (implement better cleanup strategy in production)
        if len(conversation_store) > 100:
            oldest_key = next(iter(conversation_store))
            del conversation_store[oldest_key]
            logger.info(f"Cleaned up conversation: {oldest_key}")
        
        processing_time = time.time() - start_time
        logger.info(f"Processed request in {processing_time:.2f}s using {tokens_used} tokens")
        
        return ChatResponse(
            answer=answer,
            conversation_id=conversation_id,
            tokens_used=tokens_used,
            processing_time=processing_time
        )
    
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing request: {str(e)}"
        )

# Clear conversation history
@app.delete("/conversations/{conversation_id}")
async def clear_conversation(conversation_id: str):
    if conversation_id in conversation_store:
        del conversation_store[conversation_id]
        return {"status": "success", "message": f"Conversation {conversation_id} cleared"}
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Conversation {conversation_id} not found"
    )

# List active conversations
@app.get("/conversations")
async def list_conversations():
    return {"active_conversations": list(conversation_store.keys())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)