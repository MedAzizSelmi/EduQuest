import {Component, OnInit} from '@angular/core';
import {Module} from '../../../core/models/course.model';
import {CourseService} from '../../../core/services/course.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {Quiz} from '../../../core/models/quiz.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-modules',
  templateUrl: './module-list.component.html',
  standalone: false,
  styleUrls: ['./module-list.component.scss']
})
export class ModuleListComponent implements OnInit {
  courseId!: number;
  modules: Module[] = [];
  module: Module | null = null;
  isTeacherOrAdmin = false
  loading = false

  constructor(
    private route: ActivatedRoute,
    private moduleService: CourseService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ){}

  ngOnInit() {
    this.courseId = +this.route.snapshot.paramMap.get('courseId')!
    this.isTeacherOrAdmin = this.authService.hasRole("Teacher") || this.authService.hasRole("Admin")
    this.loadModules();
  }

  loadModules() {
    this.moduleService.getModules(this.courseId).subscribe(
      (modules) => this.modules = modules,
      (error) => console.error('Error loading modules:', error)
    );
  }

  viewLessons(module: Module): void {
    this.router.navigate(["/courses", this.courseId, "modules", module.id, "lessons"]);
  }

  createModule(): void {
    this.router.navigate(["/courses", this.courseId, "modules", "create"])
  }

  editModule(module: Module): void {
    this.router.navigate(["/courses", this.courseId, "modules", module.id, "edit"])
  }

  deleteModule(module: Module): void {
    if (confirm(`Are you sure you want to delete module "${module.title}"?`)) {
      this.moduleService.deleteModule(this.courseId, module.id).subscribe({
        next: () => {
          this.snackBar.open("Module deleted successfully", "Close", {
            duration: 3000,
          })
          this.loadModules()
        },
        error: (error) => {
          this.snackBar.open(`Error deleting module: ${error}`, "Close", {
            duration: 5000,
          })
        },
      })
    }
  }

  /*readModule(module: Module): void {
    this.router.navigate(["/modules", module.id, "read"])
  }*/

  /*viewLessons(courseId: number): void {
    if(!this.module) return
    this.router.navigate(['/courses', this.module.id, 'modules']);
  }*/

  goBackToCourse(): void {
    this.router.navigate(["/courses", this.courseId])
  }

}
