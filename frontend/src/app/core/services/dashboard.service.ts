import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { Dashboard, TeacherDashboard, AdminDashboard, StudentDashboard } from "../models/dashboard.model"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/api/dashboard`

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<Dashboard | TeacherDashboard | AdminDashboard | StudentDashboard |null > {
    return this.http.get<Dashboard | TeacherDashboard | AdminDashboard | StudentDashboard |null >(this.apiUrl)
  }

  getStudentDashboard(): Observable<StudentDashboard> {
    return this.http.get<StudentDashboard>(`${this.apiUrl}/student`)
  }

  getTeacherDashboard(): Observable<TeacherDashboard> {
    return this.http.get<TeacherDashboard>(`${this.apiUrl}/teacher`)
  }

  getAdminDashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${this.apiUrl}/admin`)
  }
}
