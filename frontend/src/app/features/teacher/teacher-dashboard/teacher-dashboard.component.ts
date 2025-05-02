import { Component, Input, OnInit } from "@angular/core"
import { TeacherDashboard } from "../../../core/models/dashboard.model"

@Component({
    selector: "app-teacher-dashboard",
    templateUrl: "./teacher-dashboard.component.html",
    styleUrls: ["./teacher-dashboard.component.scss"],
    standalone: false
})
export class TeacherDashboardComponent implements OnInit {
  @Input() dashboard!: TeacherDashboard

  // For course stats table
  displayedColumns: string[] = [
    "title",
    "status",
    "enrolledStudents",
    "completionRate",
    "averageProgress",
    "quizCount",
    "examCount",
  ]

  // For enrollments table
  enrollmentColumns: string[] = ["courseTitle", "userId", "enrollmentDate"]

  constructor() {}

  ngOnInit(): void {}
}
