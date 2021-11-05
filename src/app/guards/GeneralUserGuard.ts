import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class GeneralUserGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    if(this.authService.isLoggedIn()) {
      if(this.authService.isUser())
        this.router.navigate(["/myProfile/my-trips"]);
      else if(this.authService.isAdmin()) {
        this.router.navigate(["/admin/users"]);
      }
    }
    return !this.authService.isLoggedIn();
  }
}