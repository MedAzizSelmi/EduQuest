import { Injectable } from "@angular/core"
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http"
import { type Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import { AuthService } from "../services/auth.service"
import { MatSnackBar } from "@angular/material/snack-bar"

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // Auto logout if 401 response returned from api
          this.authService.logout()
          location.reload()
        }

        const error = err.error?.message || err.statusText
        this.snackBar.open(error, "Close", {
          duration: 5000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
        })

        return throwError(() => error)
      }),
    )
  }
}
