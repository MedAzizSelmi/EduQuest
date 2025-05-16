import { Component, OnInit, Output, EventEmitter } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { User } from "../../models/user.model"

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  standalone: false
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>()

  currentUser: User | null = null
  isStudent = false
  isTeacher = false
  isAdmin = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user
      this.isStudent = user?.role === "Student"
      this.isTeacher = user?.role === "Teacher"
      this.isAdmin = user?.role === "Admin"
    })
  }

  getProfilePictureUrl(profilePicture: string | undefined): string {
    if (!profilePicture) return 'assets/default-avatar.png';

    if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
      return profilePicture;
    }

    if (profilePicture.startsWith('/profile-pictures/')) {
      return `http://localhost:5139${profilePicture}`;
    }

    return `http://localhost:5139/profile-pictures/${profilePicture}`;
  }


  onToggleSidebar(): void {
    this.toggleSidebar.emit()
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/login"])
  }
}
