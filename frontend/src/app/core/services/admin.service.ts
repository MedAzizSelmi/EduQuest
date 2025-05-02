import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { User } from "../models/user.model"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/api/admin`

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`)
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`)
  }

  createUser(user: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user)
  }

  updateUser(id: string, user: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user)
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`)
  }

  // System statistics
  getSystemStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`)
  }

  // System logs
  getSystemLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logs`)
  }
}
