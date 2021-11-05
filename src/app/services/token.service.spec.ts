import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { TokenService } from './token.service';
import { TestingElements } from 'src/test/mocks/TestingElements';

describe('TokenService', () => {
  let tokenService: TokenService;
  let httpTestingController: HttpTestingController;
  const ACCESS_TOKEN_KEY = "access-token";
  const REFRESH_TOKEN_KEY = "refresh-token";
  const USER_KEY = "auth-user";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    tokenService = TestBed.inject(TokenService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(tokenService).toBeTruthy();
  });

  describe('clearSession method', () => {
    it('should call clear session on session storage', () => {
      const sessionStorageSpy = jest.spyOn(window.sessionStorage, 'clear');

      tokenService.clearSession();

      expect(sessionStorageSpy).toHaveBeenCalled();
    })
  });

  describe('saveAccessToken method', () => {
    const ACCESS_TOKEN= "123";
    it('should remove current access token and replace it', () => {
      const removeAccessTokenSpy = jest.spyOn(tokenService, 'removeAccessToken');
      const storageSetItemSpy = jest.spyOn(window.sessionStorage, 'setItem');

      tokenService.saveAccessToken(ACCESS_TOKEN);

      expect(removeAccessTokenSpy).toHaveBeenCalled();
      expect(storageSetItemSpy).toHaveBeenCalledWith(ACCESS_TOKEN_KEY, ACCESS_TOKEN);
    });
  });

  describe('removeAccessToken method', () => {
    it('should remove access token from session storage', () => {
      const removeItemSpy = jest.spyOn(window.sessionStorage, 'removeItem');

      tokenService.removeAccessToken();

      expect(removeItemSpy).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
    });
  });

  describe('getAccessToken method', () => {
    it('should get access token from session storage', () => {
      const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');

      tokenService.getAccessToken();

      expect(getItemSpy).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
    });
  });

  describe('saveRefreshToken method', () => {
    const REFRESH_TOKEN= "123";
    it('should remove current refresh token and replace it', () => {
      const removeRefreshTokenSpy = jest.spyOn(tokenService, 'removeRefreshToken');
      const storageSetItemSpy = jest.spyOn(window.sessionStorage, 'setItem');

      tokenService.saveRefreshToken(REFRESH_TOKEN);

      expect(removeRefreshTokenSpy).toHaveBeenCalled();
      expect(storageSetItemSpy).toHaveBeenCalledWith(REFRESH_TOKEN_KEY, REFRESH_TOKEN);
    });
  });

  describe('removeRefreshToken method', () => {
    it('should remove refresh token from session storage', () => {
      const removeItemSpy = jest.spyOn(window.sessionStorage, 'removeItem');

      tokenService.removeRefreshToken();

      expect(removeItemSpy).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);
    });
  });

  describe('getRefreshToken method', () => {
    it('should get refresh token from session storage', () => {
      const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');

      tokenService.getRefreshToken();

      expect(getItemSpy).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);
    });
  });

  describe('setUser method', () => {
    it('should remove current user from session storage and set new user', () => {
      const removeItemSpy = jest.spyOn(window.sessionStorage, 'removeItem');
      const setItemSpy = jest.spyOn(window.sessionStorage, 'setItem');

      tokenService.setUser(TestingElements.USER);
      let stringifiedUser: string = JSON.stringify(TestingElements.USER);

      expect(removeItemSpy).toHaveBeenCalledWith(USER_KEY);
      expect(setItemSpy).toHaveBeenCalledWith(USER_KEY, stringifiedUser);
    });
  });

  describe('getUser method', () => {
    it('should return user stored in session storage', () => {
      const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem').mockReturnValue(JSON.stringify(TestingElements.USER));

      const user = tokenService.getUser();

      expect(user).toEqual(TestingElements.USER);
      expect(getItemSpy).toHaveBeenCalledWith(USER_KEY);
    });

    it('should return empty object', () => {
      const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem').mockReturnValue(undefined);

      const user = tokenService.getUser();

      expect(user).toEqual({});
      expect(getItemSpy).toHaveBeenCalledWith(USER_KEY);
    });
  });
});
