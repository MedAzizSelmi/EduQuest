import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../../core/services/auth.service"
import { MatSnackBar } from "@angular/material/snack-bar"
import { first } from "rxjs/operators"

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
    standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup
  loading = false
  submitted = false
  hidePassword = true
  roles = [
    { value: "Student", viewValue: "Student" },
    { value: "Teacher", viewValue: "Teacher" },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      role: ["Student", Validators.required],
    })

    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/"])
    }
  }

  get f() {
    return this.registerForm.controls
  }

  onSubmit(): void {
    this.submitted = true

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return
    }

    this.loading = true
    this.authService
      .register({
        firstName: this.f["firstName"].value,
        lastName: this.f["lastName"].value,
        username: this.f["username"].value,
        email: this.f["email"].value,
        password: this.f["password"].value,
        role: this.f["role"].value,
      })
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackBar.open("Registration successful", "Close", {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          })
          this.router.navigate(["/"])
        },
        error: (error) => {
          this.loading = false
        },
      })
  }
}
