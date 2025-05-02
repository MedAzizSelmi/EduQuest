import { Injectable } from "@angular/core"
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http"
import {BehaviorSubject, type Observable, map, throwError} from "rxjs"
import { User, RegisterRequest, LoginRequest, UpdateUserRequest } from "../models/user.model"
import { environment } from "../../../environments/environment"
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>
  public currentUser: Observable<User | null>
  private apiUrl = `${environment.apiUrl}/api/account`

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem("currentUser")
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null)
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value
  }

  register(registerRequest: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, registerRequest).pipe(
      map((user) => {
        localStorage.setItem("currentUser", JSON.stringify(user))
        this.currentUserSubject.next(user)
        return user
      }),
    )
  }

  // In your login method:
  login(loginRequest: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, loginRequest).pipe(
      map((user) => {
        // Ensure the token is included in the stored user object
        const userWithToken = {
          ...user,
          token: user.token // Make sure your API returns the token
        };
        localStorage.setItem("currentUser", JSON.stringify(userWithToken));
        this.currentUserSubject.next(userWithToken);
        return userWithToken;
      })
    );
  }

  logout(): void {
    localStorage.removeItem("currentUser")
    this.currentUserSubject.next(null)
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}`)
  }

  updateUser(updateData: UpdateUserRequest | FormData): Observable<User> {
    // 1. Get current token
    const token = this.currentUserValue?.token;
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    // 2. Prepare base headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    let request: Observable<User>;

    if (updateData instanceof FormData) {
      // For FormData - let browser set Content-Type with boundary
      request = this.http.put<User>(`${this.apiUrl}`, updateData, {
        headers: headers // Include auth token
      });
    } else {
      // For JSON data
      request = this.http.put<User>(`${this.apiUrl}`, updateData, {
        headers: headers.set('Content-Type', 'application/json')
      });
    }

    return request.pipe(
      map((user) => {
        const updatedUser = { ...this.currentUserValue, ...user };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
        return updatedUser;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Update User Error:', error); // Detailed logging

        let errorMessage = 'Failed to update profile';

        // Handle different error types
        if (error.status === 401) {
          errorMessage = 'Session expired. Please login again.';
        } else if (error.error?.errors) {
          errorMessage = Object.entries(error.error.errors)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }

  // Optional: Add a dedicated method for profile picture upload
  updateProfilePicture(imageFile: File): Observable<User> {
    const formData = new FormData();
    formData.append('profilePicture', imageFile);
    return this.updateUser(formData);
  }
}
