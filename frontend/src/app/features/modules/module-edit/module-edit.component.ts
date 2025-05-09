import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { ExamService } from "../../../core/services/exam.service"
import {CourseService} from '../../../core/services/course.service';
import {Module} from '../../../core/models/course.model';

@Component({
  selector: "app-module-edit",
  templateUrl: "./module-edit.component.html",
  styleUrls: ["./module-edit.component.scss"],
  standalone: false
})
export class ModuleEditComponent implements OnInit {
  moduleForm!: FormGroup
  loading = false
  submitted = false
  module: Module | null = null
  courseId!: number
  moduleId!: number
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
    this.moduleId = +this.route.snapshot.paramMap.get("moduleId")!
    this.initForm()
    this.loadModule()
  }

  initForm(): void {

    this.moduleForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ["", [Validators.required, Validators.minLength(20)]],
      order: ["", [Validators.required, Validators.maxLength(2), Validators.minLength(1)]],
      lessonsCount: ["", [Validators.required]]
    })
  }
  loadModule(): void {
    this.loading = true
    this.moduleService.getModuleById(this.courseId, this.moduleId).subscribe({
      next: (module) => {
        this.module = module
        this.moduleForm.patchValue({
          title: module.title,
          description: module.description,
          order: module.order,
          lessonsCount: module.lessonsCount,
        })
        this.loading = false
      },
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

    this.moduleService.updateModule(this.courseId, this.moduleId, moduleData).subscribe({
      next: (module) => {
        this.snackBar.open("module updated successfully", "Close", {
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
