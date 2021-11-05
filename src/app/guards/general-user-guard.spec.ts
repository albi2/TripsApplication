import { TestBed } from "@angular/core/testing";
import { AuthService } from "../services/auth.service";
import { GeneralUserGuard } from "./GeneralUserGuard";
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from "@angular/router";
import { AdminGuard } from "./AdminGuard";
import { UsersComponent } from "../components/users/users.component";
import { MyProfileComponent } from "../pages/my-profile/my-profile.component";
import { MyTripsComponent } from "../components/my-trips/my-trips.component";

/**
 * MOCKS
 */
jest.mock("../services/auth.service");
jest.mock("../pages/my-profile/my-profile.component");
jest.mock("../components/my-trips/my-trips.component");
jest.mock("../components/users/users.component");

describe("AdminGuard", () => {
    let authService: AuthService;
    let router: Router;
    let guard: GeneralUserGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GeneralUserGuard, AuthService],
            imports: [RouterTestingModule.withRoutes([
                {path: 'myProfile', component: MyProfileComponent, children: [
                  {path: 'my-trips', component: MyTripsComponent},
                ]},
                {path: 'admin', component: MyProfileComponent, children: [
                  {path: 'users', component: UsersComponent},
                ], canActivate: [AdminGuard]},
            ])
          ]
        }).compileComponents();

        authService = TestBed.inject(AuthService);
        guard = TestBed.inject(GeneralUserGuard);
        router = TestBed.inject(Router);
    });

    it('should be created', () => { 
        expect(guard).toBeTruthy();
    });

    describe('canActivate method', () => {
        it('should allow user to be logged in and go to the user trips page', () => {
            let isLoggedInSpy = jest.spyOn(authService, 'isLoggedIn').mockReturnValue(true);
            let isUserSpy = jest.spyOn(authService, 'isUser').mockReturnValue(true);
            let navigateSpy = jest.spyOn(router, 'navigate');

            let result = guard.canActivate();

            // Returns false because it is not a general user it controls for visitors
            expect(result).toEqual(false);
            expect(isLoggedInSpy).toHaveBeenCalled();
            expect(isUserSpy).toHaveBeenCalled();
            expect(navigateSpy).toHaveBeenCalledWith(["/myProfile/my-trips"]);
        });

        it('should allow user to log in and go to the admin page', () => {
            let isLoggedInSpy = jest.spyOn(authService, 'isLoggedIn').mockReturnValue(true);
            let isUserSpy = jest.spyOn(authService, 'isUser').mockReturnValue(false);
            let isAdminSpy = jest.spyOn(authService, 'isAdmin').mockReturnValue(true);
            let navigateSpy = jest.spyOn(router, 'navigate');

            let result = guard.canActivate();

            expect(result).toEqual(false);
            expect(isLoggedInSpy).toHaveBeenCalled();
            expect(isUserSpy).toHaveBeenCalled();
            expect(isAdminSpy).toHaveBeenCalled();
            expect(navigateSpy).toHaveBeenCalledWith(["/admin/users"]);
        });

        it('should return true as the user is not logged in and is a visitor', () => {
            let isLoggedInSpy = jest.spyOn(authService, 'isLoggedIn').mockReturnValue(false);

            let result = guard.canActivate();

            expect(result).toEqual(true);
            expect(isLoggedInSpy).toHaveBeenCalled();
        })
    });
});