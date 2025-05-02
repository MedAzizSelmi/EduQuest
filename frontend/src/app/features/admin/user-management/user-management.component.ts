import { Component, type OnInit } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { MatSnackBar } from "@angular/material/snack-bar"
import { User } from "../../../core/models/user.model"
import { AdminService } from "../../../core/services/admin.service"

@Component({
    selector: "app-user-management",
    templateUrl: "./user-management.component.html",
    styleUrls: ["./user-management.component.scss"],
    standalone: false
})
export class UserManagementComponent implements OnInit {
  users: User[] = []
  filteredUsers: User[] = []
  loading = false
  searchTerm = ""
  roleFilter = "All"

  displayedColumns: string[] = ["username", "email", "firstName", "lastName", "role", "points", "level", "actions"]

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.loading = true
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users
        this.applyFilters()
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  applyFilters(): void {
    let filtered = this.users

    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search),
      )
    }

    // Apply role filter
    if (this.roleFilter !== "All") {
      filtered = filtered.filter((user) => user.role === this.roleFilter)
    }

    this.filteredUsers = filtered
  }

  onSearch(): void {
    this.applyFilters()
  }

  onRoleFilterChange(): void {
    this.applyFilters()
  }

  editUser(user: User): void {
    // Open edit user dialog
    // Implementation would depend on your dialog component
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open("User deleted successfully", "Close", {
            duration: 3000,
          })
          this.loadUsers()
        },
        error: (error) => {
          this.snackBar.open(`Error deleting user: ${error}`, "Close", {
            duration: 5000,
          })
        },
      })
    }
  }
}
