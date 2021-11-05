import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";
import { TokenService } from "../services/token.service";
import { User } from "../models/User";

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate{
  constructor(private authService: AuthService, private token: TokenService) { }

  canActivate() {
    if(this.authService.isLoggedIn()) {
        let user: User = this.token.getUser();
        if(user.roles.includes('ROLE_ADMIN'))
            return true;
    }
    
    return false;
  }
}