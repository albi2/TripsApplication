import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtResponse } from '../models/JwtResponse';
import { LoginRequest } from '../models/LoginRequest';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { RefreshTokenResponse } from '../models/RefreshTokenResponse';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { UserCreationDTO } from '../models/UserCreationDTO';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly API_URI;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient, private tokenService: TokenService,
    private router: Router) {
    this.API_URI = "http://localhost:8080/api/auth/";
  }

  // private errorHandler(error: HttpErrorResponse) {
  // }

  isLoggedIn() {
    return !!this.tokenService.getAccessToken();
  }

  public login(username: string, password: string) {
    let body: LoginRequest = {
      username: username,
      password: password
    };

    return this.http.post<JwtResponse>(this.API_URI + "signin", body, this.httpOptions)
      .pipe(shareReplay(),
        tap((response: JwtResponse) => {
          this.tokenService.saveAccessToken(response.accessToken);
          this.tokenService.saveRefreshToken(response.refreshToken);
          this.tokenService.setUser({
            id: response.id,
            username: response.username,
            email: response.email,
            roles: response.roles
          });
        })
      );
  }

  public getRefreshToken(): Observable<RefreshTokenResponse> {
    let refreshToken = { refreshToken: this.tokenService.getRefreshToken() };
    return this.http.post<RefreshTokenResponse>(this.API_URI + "refreshJwtToken", refreshToken, this.httpOptions);
  }

  public logout() {
    // let component = new HomepageComponent();
    // component.toggle(true);
    this.tokenService.clearSession();
    this.router.navigate(["/home"]);
  }

  public isUser(): boolean {
    let loggedInUser: User = this.tokenService.getUser();
    if (loggedInUser) {
      return loggedInUser.roles.includes("ROLE_USER");
    }

    return false;
  }

  public isAdmin(): boolean {
    let loggedInUser: User = this.tokenService.getUser();
    if (loggedInUser) {
      return loggedInUser.roles.includes("ROLE_ADMIN");
    }

    return false;
  }

  public createUser(newUser: UserCreationDTO) {
    return this.http.post<User>(this.API_URI + "signup", newUser, this.httpOptions);
  }
}
