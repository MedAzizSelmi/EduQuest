import { Component, OnInit, Input } from "@angular/core"
import { AuthService } from "../../services/auth.service"
import { User } from "../../models/user.model"

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
    standalone: false
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = true

  currentUser: User | null = null
  isStudent = false
  isTeacher = false
  isAdmin = false

  constructor(protected authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user
      this.isStudent = user?.role === "Student"
      this.isTeacher = user?.role === "Teacher"
      this.isAdmin = user?.role === "Admin"
    })
  }
}
