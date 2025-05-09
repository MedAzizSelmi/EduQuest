import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatSnackBar } from "@angular/material/snack-bar"
import { AuthService } from "../../core/services/auth.service"
import { User } from "../../core/models/user.model"

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  standalone: false
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null
  profileForm!: FormGroup
  loading = false
  submitted = false
  editMode = false
  selectedImage: string | ArrayBuffer | null = null
  selectedFile: File | null = null

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue
    this.initForm()
  }

  initForm(): void {
    this.profileForm = this.formBuilder.group({
      firstName: [this.currentUser?.firstName || "", Validators.required],
      lastName: [this.currentUser?.lastName || "", Validators.required],
      bio: [this.currentUser?.bio || ""],
    })

    // Disable form initially
    this.profileForm.disable()
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode

    if (this.editMode) {
      this.profileForm.enable()
    } else {
      this.profileForm.disable()
      this.initForm() // Reset form to original values
      this.selectedImage = null
      this.selectedFile = null
    }
  }

  get f() {
    return this.profileForm.controls
  }

  getProfilePictureUrl(profilePicture: string): string {
    return profilePicture
      ? `http://localhost:5139/profile-pictures/${profilePicture}`
      : 'assets/default-avatar.png';
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('firstName', this.profileForm.value.firstName);
    formData.append('lastName', this.profileForm.value.lastName);
    formData.append('bio', this.profileForm.value.bio);

    // Always include profilePicture field, even if null
    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile);
    } else {
      // Append null or empty value if no file is selected
      formData.append('profilePicture', new Blob(), 'empty');
    }

    this.authService.updateUser(formData).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loading = false;
        this.editMode = false;
        this.profileForm.disable();
        this.selectedImage = null;
        this.selectedFile = null;
        this.snackBar.open("Profile updated successfully", "Close", {
          duration: 3000,
        });
      },
      error: (error) => {
        this.loading = false;
        console.error('Full error:', error);

        let errorMessage = 'Failed to update profile';
        if (error.status === 401) {
          errorMessage = 'Session expired. Please login again.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.errors?.ProfilePicture) {
          errorMessage = error.error.errors.ProfilePicture[0];
        }

        this.snackBar.open(errorMessage, "Close", {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
