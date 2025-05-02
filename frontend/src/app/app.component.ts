import { Component } from "@angular/core"

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    standalone: false
})
export class AppComponent {
  sidebarOpen = true

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen
  }
}
