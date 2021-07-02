import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  readonly ACCESS_TOKEN_KEY = "access-token";
  readonly REFRESH_TOKEN_KEY = "refresh-token";
  readonly USER_KEY = "auth-user";

  constructor() { }

  clearSession() {
    window.sessionStorage.clear();
  }

  public saveAccessToken(token: string) {
    this.removeAccessToken();
    window.sessionStorage.setItem(this.ACCESS_TOKEN_KEY,token);
  }

  public removeAccessToken() {
    window.sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  public getAccessToken(): string {
    return window.sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public saveRefreshToken(token: string) {
    this.removeRefreshToken();
    window.sessionStorage.setItem(this.REFRESH_TOKEN_KEY,token);
  }

  public removeRefreshToken() {
    window.sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  public getRefreshToken() {
    return window.sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public setUser(user: User) {
    window.sessionStorage.removeItem(this.USER_KEY);
    window.sessionStorage.setItem(this.USER_KEY,JSON.stringify(user));
  }

  public getUser() {
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}
