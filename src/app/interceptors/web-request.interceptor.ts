import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import {  Injectable } from "@angular/core";
import { empty, throwError } from "rxjs";
import { catchError,switchMap} from "rxjs/operators";
import { RefreshTokenResponse } from "../models/RefreshTokenResponse";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";

@Injectable({
    providedIn: 'root'
})
export class WebRequestInterceptor implements HttpInterceptor {
    private isRefreshing = false;

    constructor(private tokenService: TokenService, private auth: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let request = this.addAuthHeader(req);

        return next.handle(request).pipe(
            catchError( (error: HttpErrorResponse) => {
                if((error.status === 403 || error.status===401)  && !this.isRefreshing) {
                    // Check if user authenticated but doesn't have authority
                    // Try getting new refresh token in case access token has expired
                    return this.handleRefreshToken(request,next);
                }

                // Return the error to manage through some handler
                return throwError(error);
            })
        );
    }


    private handleRefreshToken(request: HttpRequest<any>,next: HttpHandler) {
            this.isRefreshing = true;

            return this.auth.getRefreshToken().pipe(switchMap((res: RefreshTokenResponse) => {
                this.isRefreshing = false;

                this.tokenService.saveAccessToken(res.accessToken);
                this.tokenService.saveRefreshToken(res.refreshToken);
                request = this.addAuthHeader(request);
                // Continue request after unauthorized request
                return next.handle(request);
            }),
            catchError((err: any) => {
                // If could not get refresh token log user out
                console.log(err);
                this.auth.logout();
                return empty();
            }));

    }

    private addAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
        const accessToken: string = this.tokenService.getAccessToken();
        if(accessToken != null)
         req = req.clone({setHeaders: { Authorization:  "Bearer "+accessToken}});
        return req;
    }
}