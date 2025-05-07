using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using ELearningPlatform.API.Models;

namespace ELearningPlatform.API.Controllers
{
    [ApiController]
    [Route("api/courses/{courseId}/[controller]")]
    public class ModulesController : ControllerBase
    {
        private readonly IModuleService _moduleService;

        public ModulesController(IModuleService moduleService)
        {
            _moduleService = moduleService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Module>>> GetModules(int courseId)
        {
            var modules = await _moduleService.GetModulesByCourse(courseId);
            return Ok(modules);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Module>> GetModule(int id)
        {
            var module = await _moduleService.GetModule(id);
            if (module == null) return NotFound();
            return Ok(module);
        }

        [HttpPost]
        public async Task<ActionResult<Module>> CreateModule(int courseId, CreateModuleDto moduleDto)
        {
            moduleDto.CourseId = courseId;
            var module = await _moduleService.CreateModule(moduleDto);
            return CreatedAtAction(nameof(GetModule), new { courseId, id = module.Id }, module);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Module>> UpdateModule(int id, UpdateModuleDto moduleDto)
        {
            var module = await _moduleService.UpdateModule(id, moduleDto);
            if (module == null) return NotFound();
            return Ok(module);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteModule(int id)
        {
            var success = await _moduleService.DeleteModule(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}