import { Component, Input, type OnInit } from "@angular/core"
import { AdminDashboard } from "../../../core/models/dashboard.model"

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
  standalone: false
})
export class AdminDashboardComponent implements OnInit {
  @Input() dashboard!: AdminDashboard

  // For top courses table
  displayedColumns: string[] = ["title", "teacherName", "enrollmentCount", "completionRate", "averageRating"]

  constructor() {}

  ngOnInit(): void {}
}
