import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { ExamService } from "../../../core/services/exam.service"
import {CourseService} from '../../../core/services/course.service';

@Component({
  selector: "app-module-create",
  templateUrl: "./module-create.component.html",
  styleUrls: ["./module-create.component.scss"],
  standalone: false
})
export class ModuleCreateComponent implements OnInit {
  moduleForm!: FormGroup
  loading = false
  submitted = false
  courseId!: number
  minDate = new Date()

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private moduleService: CourseService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get("courseId")!
    this.initForm()
  }

  initForm(): void {

    this.moduleForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ["", [Validators.required, Validators.minLength(20)]],
      order: ["", [Validators.required, Validators.maxLength(2), Validators.minLength(1)]],
      lessonsCount: ["", [Validators.required]]
    })
  }

  get f() {
    return this.moduleForm.controls
  }

  onSubmit(): void {
    this.submitted = true

    if (this.moduleForm.invalid) {
      return
    }

    this.loading = true
    const moduleData = {
      ...this.moduleForm.value,
      courseId: this.courseId,
    }

    this.moduleService.createModule(moduleData).subscribe({
      next: (module) => {
        this.snackBar.open("module created successfully", "Close", {
          duration: 3000,
        })
        this.router.navigate(["/courses", this.courseId, "modules"])
      },
      error: (error) => {
        this.loading = false
        this.snackBar.open(`Error creating module: ${error}`, "Close", {
          duration: 5000,
        })
      },
    })
  }

  onCancel(): void {
    this.router.navigate(["/courses", this.courseId, "modules"])
  }
}
