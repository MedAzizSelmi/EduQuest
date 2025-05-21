import { Component } from "@angular/core"
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    standalone: false
})
export class AppComponent {
  sidebarOpen = true
  showChat= true

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showChat = !['/login', '/register'].includes(event.url);
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen
  }
}
