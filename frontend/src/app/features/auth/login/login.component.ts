import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { AuthService } from "../../../core/services/auth.service"
import { MatSnackBar } from "@angular/material/snack-bar"
import { first } from "rxjs/operators"

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    standalone: false
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  loading = false
  submitted = false
  returnUrl = "/"
  hidePassword = true

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/"

    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl])
    }
  }

  get f() {
    return this.loginForm.controls
  }

  onSubmit(): void {
    this.submitted = true

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return
    }

    this.loading = true
    this.authService
      .login({
        email: this.f["email"].value,
        password: this.f["password"].value,
      })
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackBar.open("Login successful", "Close", {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          })
          this.router.navigate([this.returnUrl])
        },
        error: (error) => {
          this.loading = false
        },
      })
  }
}
