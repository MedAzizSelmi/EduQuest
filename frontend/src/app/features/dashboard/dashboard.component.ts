import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../../core/services/auth.service"
import { DashboardService } from "../../core/services/dashboard.service"
import { Dashboard, TeacherDashboard, AdminDashboard, StudentDashboard } from "../../core/models/dashboard.model"
import { User } from "../../core/models/user.model"

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  standalone: false
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null
  dashboard: any;//Dashboard | TeacherDashboard | AdminDashboard | StudentDashboard |null = null
  loading = false

  constructor(
    private router: Router,
    private authService: AuthService,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue
    this.loadDashboard()
  }

  loadDashboard(): void {
    this.loading = true
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  navigateToRoleDashboard(): void {
    if (this.currentUser) {
      switch (this.currentUser.role) {
        case "Student":
          this.router.navigate(["/student"])
          break
        case "Teacher":
          this.router.navigate(["/teacher"])
          break
        case "Admin":
          this.router.navigate(["/admin"])
          break
      }
    }
  }
}
