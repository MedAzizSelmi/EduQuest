import { Component, Input, OnInit } from "@angular/core"
import {Dashboard, StudentDashboard} from "../../../core/models/dashboard.model"

@Component({
  selector: "app-student-dashboard",
  templateUrl: "./student-dashboard.component.html",
  styleUrls: ["./student-dashboard.component.scss"],
  standalone: false
})
export class StudentDashboardComponent implements OnInit {
  @Input() dashboard!: StudentDashboard

  // For activity table
  displayedColumns: string[] = ["title", "type", "date", "status", "progress", "score"]

  // For upcoming exams table
  examColumns: string[] = ["title", "courseTitle", "startDate", "endDate", "timeLimit", "isFinal"]

  constructor() {}

  ngOnInit(): void {}
}
