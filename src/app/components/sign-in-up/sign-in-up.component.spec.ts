import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SignInUpComponent } from './sign-in-up.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterTestingModule } from '@angular/router/testing';
import { MyProfileComponent } from 'src/app/pages/my-profile/my-profile.component';
import { MyTripsComponent } from '../my-trips/my-trips.component';
import { UsersComponent } from '../users/users.component';
import { AdminGuard } from 'src/app/guards/AdminGuard';
import { Router } from '@angular/router';
import { JwtResponse } from 'src/app/models/JwtResponse';
import { of, throwError } from 'rxjs';

// MOCKS
jest.mock('src/app/services/auth.service');
jest.mock('src/app/pages/my-profile/my-profile.component');
jest.mock('../my-trips/my-trips.component');
jest.mock('../users/users.component');
jest.mock('src/app/guards/AdminGuard');

describe('SignInUpComponent', () => {
  let component: SignInUpComponent;
  let fixture: ComponentFixture<SignInUpComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignInUpComponent],
      providers: [AuthService],
      imports: [
        RouterTestingModule.withRoutes(
          [
            {path: 'myProfile', component: MyProfileComponent, children: [
              {path: 'my-trips', component: MyTripsComponent}
            ]},
            {path: 'admin', component: MyProfileComponent, children: [
              {path: 'users', component: UsersComponent},
            ], canActivate: [AdminGuard]},
          ]
        ),
        ReactiveFormsModule, FormsModule, MatFormFieldModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInUpComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onLoginClicked method', () => {
    let response: JwtResponse = {
      accessToken: '123123123',
      type: 'Bearer',
      refreshToken: '123123123',
      id: 1,
      username: 'albi',
      email: 'albitaulla@yahoo.com',
      roles: ['ROLE_USER']
    };
    
    it('should navigate to the user page', () => {
      let loginSpy = jest.spyOn(authService, 'login').mockReturnValue(of(response));
      let navigateSpy = jest.spyOn(router, 'navigate');
      let isUserSpy = jest.spyOn(authService, 'isUser').mockReturnValue(true);

      component.signupMode = false;
      let username = component.signInGroup.controls['username'];
      let password = component.signInGroup.controls['password'];

      username.setValue('albi');
      password.setValue('frenkli1');
      fixture.detectChanges();

      component.onLoginClicked();
      
      expect(navigateSpy).toHaveBeenCalledWith(['/myProfile/my-trips']);
      expect(loginSpy).toHaveBeenCalled();
      expect(isUserSpy).toHaveBeenCalled();
    });

    it('should navigate to the admin page', () => {
      let loginSpy = jest.spyOn(authService, 'login').mockReturnValue(of(response));
      let navigateSpy = jest.spyOn(router, 'navigate');
      let isUserSpy = jest.spyOn(authService, 'isUser').mockReturnValue(false);
      let isAdminSpy = jest.spyOn(authService, 'isAdmin').mockReturnValue(true);

      component.signupMode = false;
      let username = component.signInGroup.controls['username'];
      let password = component.signInGroup.controls['password'];

      username.setValue('albi');
      password.setValue('frenkli1');
      fixture.detectChanges();

      component.onLoginClicked();
      
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/users']);
      expect(isUserSpy).toHaveBeenCalled();
      expect(isAdminSpy).toHaveBeenCalled();
    });

    it('should throw error', () => {
      const error = new Error('User could not be found');
      let loginSpy = jest.spyOn(authService, 'login').mockReturnValue(throwError(error));
      let consoleLogSpy = jest.spyOn(console, 'log');


      component.signupMode = false;
      let username = component.signInGroup.controls['username'];
      let password = component.signInGroup.controls['password'];

      username.setValue('albiii');
      password.setValue('frenkli1');
      fixture.detectChanges();

      component.onLoginClicked();
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
    });
  });
});
