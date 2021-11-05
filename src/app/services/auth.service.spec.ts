import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import HomepageComponent from 'src/app/pages/homepage/homepage.component';
import { TokenService } from './token.service';
import { JwtResponse } from '../models/JwtResponse';
import { RefreshTokenResponse } from '../models/RefreshTokenResponse';
import { Router } from '@angular/router';
import { TestingElements } from 'src/test/mocks/TestingElements';
import {isEqual } from 'lodash';

// MOCKING THE CLASSES
jest.mock('src/app/pages/homepage/homepage.component.ts');
jest.mock('src/app/services/token.service.ts');

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;
  let tokenService: TokenService;
  let apiUri = "http://localhost:8080/api/auth";
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        RouterTestingModule.withRoutes(
          [{ path: 'home', component: HomepageComponent }]
        )],
      providers: [TokenService]
    });

    (HomepageComponent as jest.Mock).mockClear();
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
    expect(HomepageComponent).not.toHaveBeenCalled();

    // authService.logout();

    // const homepageComponentInstance = (HomepageComponent as jest.Mock).mock.instances[0];
    // const toggleMock = homepageComponentInstance.toggle;

    // expect(toggleMock.mock.calls[0][0]).toEqual(true);
  });

  describe('isLoggedIn method', () => {
    it('should return true', () => {
      // The class is mocked using jest, all the methods are mock function which we can spyOn and mock the mock functions
      // The other way would be to use the manual mocks, see documentation
      // console.log(tokenService);
      let getAccessTokenSpy = jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('123123123');

      let result = authService.isLoggedIn();
      expect(getAccessTokenSpy).toHaveBeenCalled();
      expect(result).toEqual(true);
    })
  })

  describe('login methods', () => {
    const USERNAME = 'albi';
    const PASSWORD = 'frenkli1';

    it('should return the jwt response for the logged in user', () => {
      let response: JwtResponse = {
        accessToken: '123123123',
        type: 'Bearer',
        refreshToken: '123123123',
        id: 1,
        username: 'albi',
        email: 'albitaulla@yahoo.com',
        roles: ['ROLE_USER']
      };


      authService.login(USERNAME, PASSWORD).subscribe(jwtResponse => {
        expect(jwtResponse).toEqual(response);
        expect(jwtResponse.accessToken).toEqual(response.accessToken);
        expect(tokenService.saveAccessToken).toHaveBeenCalledWith(response.accessToken);
        expect(tokenService.saveRefreshToken).toHaveBeenCalledWith(response.refreshToken);
      })

      const path = `${apiUri}/signin`;
      let requests = httpTestingController.match(request => {
        return (request.url === path && request.body.username === USERNAME && request.body.password === PASSWORD);
      });

      expect(requests[0].request.method).toEqual('POST');

      requests[0].flush(response);
    })

  });

  describe('getRefreshToken method', () => {
    it('should return REFRESH_TOKEN', () => {
      const REFRESH_TOKEN = '123123123';
      const response: RefreshTokenResponse = {
        accessToken: '123123123',
        refreshToken: '123123123',
        type: 'Bearer'
      }
      const getRefreshTokenSpy = jest.spyOn(tokenService, 'getRefreshToken').mockReturnValue(REFRESH_TOKEN);

      authService.getRefreshToken().subscribe(response => {
        expect(response.refreshToken).toEqual(REFRESH_TOKEN);
      });

      const path = `${apiUri}/refreshJwtToken`;
      let requests = httpTestingController.match(request => {
        return request.url === path && request.body.refreshToken === REFRESH_TOKEN;
      })

      expect(requests[0].request.method).toEqual('POST');
      expect(getRefreshTokenSpy).toHaveBeenCalled()

      requests[0].flush(response);
    })
  });

  describe('logout method', () => {
    it('should clear session and navigate home', () => {
      // Declare spies before the method is called
      const routerNavigateSpy = jest.spyOn(router, 'navigate');

      authService.logout();

      expect(tokenService.clearSession).toHaveBeenCalled();
      expect(routerNavigateSpy).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('isUser method', () => {
    it('should return true', () => {
      const getUserSpy = jest.spyOn(tokenService, 'getUser').mockReturnValue(TestingElements.USER);

      const result = authService.isUser();
      expect(result).toBe(true);
      expect(getUserSpy).toHaveBeenCalled();
    });

    it('should return false, user has no roles', () => {
      const getUserSpy = jest.spyOn(tokenService, 'getUser').mockReturnValue({...TestingElements.USER, roles:[]});
      
      const result = authService.isUser();
      
      expect(result).toBe(false);
      expect(getUserSpy).toHaveBeenCalled();
    });

    it('should return false because there is no logged in user', () => {
      const getUserSpy = jest.spyOn(tokenService, 'getUser').mockReturnValue(undefined);
      const result = authService.isUser();

      expect(result).toBe(false);
      expect(getUserSpy).toHaveBeenCalled();
    })
  });

  describe('isAdmin method', () => {
    it('should return true', () => {
      const getUserSpy = jest.spyOn(tokenService, 'getUser').mockReturnValue(TestingElements.ADMIN);

      const result = authService.isAdmin();

      expect(result).toBe(true);
      expect(getUserSpy).toHaveBeenCalled();
    });

    it('should return false', () => {
      const getUserSpy = jest.spyOn(tokenService, 'getUser').mockReturnValue(TestingElements.USER);

      const result = authService.isAdmin();

      expect(result).toBe(false);
      expect(getUserSpy).toHaveBeenCalled();
    });

    it('should return false because there is no logged in user', () => {
      const getUserSpy = jest.spyOn(tokenService, 'getUser').mockReturnValue(undefined);

      const result = authService.isAdmin();

      expect(result).toBe(false);
      expect(getUserSpy).toHaveBeenCalled();
    })
  });

  describe('createUser method', () => {
    it('should return user', () => {
      authService.createUser(TestingElements.USER_CREATE).subscribe(user => {
        expect(user).toEqual(TestingElements.USER);
      });
  
      const path = `${apiUri}/signup`;
      let requests = httpTestingController.match(request => {
        return (request.url === path && isEqual(request.body, TestingElements.USER_CREATE));
      });
  
      expect(requests[0].request.method).toEqual('POST');
  
      requests[0].flush(TestingElements.USER);
    });

  })
});
