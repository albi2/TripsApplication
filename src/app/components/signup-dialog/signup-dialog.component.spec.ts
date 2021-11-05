import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupDialogComponent } from './signup-dialog.component';

describe('SignupDialogComponent', () => {
  let component: SignupDialogComponent;
  let fixture: ComponentFixture<SignupDialogComponent>;
  let dialogRef: MatDialogRef<SignupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ReactiveFormsModule, FormsModule, MatIconModule, MatInputModule,
        MatFormFieldModule, MatDialogModule],
      providers: [{
        provide: MatDialogRef,
        useValue: {
          close: (dialogResult: any) => { }
        }
      }],
      declarations: [ SignupDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClick method', () => {
    it('should call dialogRef close', () => {
      const dialogCloseSpy = jest.spyOn(dialogRef, 'close');

      component.onNoClick();

      expect(dialogCloseSpy).toHaveBeenCalled();
    });
  });

  describe('testing signUp form' , () => {
    describe('singup form', () => {
      it('should not be valid', () => { 
        expect(component.signUpGroup.valid).toBeFalsy();
      });

      it('should be valid', () => {
        let username = component.signUpGroup.controls['username'];
        username.setValue('albi');
        let email = component.signUpGroup.controls['email'];
        email.setValue('albi@test.com');
        let password = component.signUpGroup.controls['password'];
        password.setValue('frenkli1');

        const emailError = email.errors || {};
        const usernameError = username.errors || {};
        const passwordError = password.errors || {};

        expect(usernameError).toEqual({});
        expect(emailError).toEqual({});
        expect(passwordError).toEqual({});
        expect(component.signUpGroup.valid).toBeTruthy();
      });

      it('should have invalid fields', () => {
        let username = component.signUpGroup.controls['username'];
        let email = component.signUpGroup.controls['email'];
        email.setValue('albi.com');
        let password = component.signUpGroup.controls['password'];
        password.setValue('frenkli');

        
        const emailError = email.errors || {};
        const usernameError = username.errors || {};
        const passwordError = password.errors || {};

        expect(emailError['email']).toBeTruthy();
        expect(usernameError['required']).toBeTruthy();
        expect(passwordError['minlength']).toBeTruthy();
      });
    })
  })
});
