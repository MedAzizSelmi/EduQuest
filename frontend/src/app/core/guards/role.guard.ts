import { Injectable } from "@angular/core"
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router"
import type { Observable } from "rxjs"
import { AuthService } from "../services/auth.service"

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const roles = route.data["roles"] as Array<string>

    if (this.authService.isAuthenticated() && roles.includes(this.authService.currentUserValue?.role || "")) {
      return true
    }

    // Not authorized so redirect to home page
    this.router.navigate(["/"])
    return false
  }
}
