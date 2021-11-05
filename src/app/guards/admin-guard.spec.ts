import { TestBed } from "@angular/core/testing";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";
import { AdminGuard } from "./AdminGuard";
import { TestingElements } from "src/test/mocks/TestingElements";

/**
 * MOCKS
 */
jest.mock("../services/auth.service");
jest.mock("../services/token.service");

describe("AdminGuard", () => {
    let authService: AuthService;
    let tokenService: TokenService;
    let guard: AdminGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AdminGuard, AuthService, TokenService]
        }).compileComponents();

        authService = TestBed.inject(AuthService);
        tokenService = TestBed.inject(TokenService);
        guard = TestBed.inject(AdminGuard);
    });

    it('should be created', () => { 
        expect(guard).toBeTruthy();
    });

    describe('canActivate method', () => {
        it('should return true', () => {
            let isLoggedInSpy = jest.spyOn(authService, 'isLoggedIn').mockReturnValue(true);
            let getUserSpy = jest.spyOn(tokenService, 'getUser').mockReturnValue(TestingElements.ADMIN);

            let result = guard.canActivate();

            expect(isLoggedInSpy).toHaveBeenCalled();
            expect(getUserSpy).toHaveBeenCalled();
            expect(result).toEqual(true);
        });

        it('should return false because user si not admin', () => {
            let isLoggedInSpy = jest.spyOn(authService, 'isLoggedIn').mockReturnValue(true);
            let getUserSpy = jest.spyOn(tokenService, 'getUser').mockReturnValue(TestingElements.USER);

            let result = guard.canActivate();

            expect(isLoggedInSpy).toHaveBeenCalled();
            expect(getUserSpy).toHaveBeenCalled();
            expect(result).toEqual(false);
        });

        it('should return false because is user is not logged in', () => {
            let isLoggedInSpy = jest.spyOn(authService, 'isLoggedIn').mockReturnValue(false);

            let result = guard.canActivate();

            expect(isLoggedInSpy).toHaveBeenCalled();
            expect(result).toEqual(false);
        });
    });
});