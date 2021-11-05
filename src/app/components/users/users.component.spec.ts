import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { AdminService } from '../../services/admin.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule, MatDialogRef, _MatDialogContainerBase } from '@angular/material/dialog';
import { MatDividerModule} from '@angular/material/divider';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { MyProfileComponent } from 'src/app/pages/my-profile/my-profile.component';
import { AdminUserDetailsComponent } from '../admin-user-details/admin-user-details.component';
import { AdminGuard } from 'src/app/guards/AdminGuard';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PagedResponse } from 'src/app/models/PagedResponse';
import { User } from 'src/app/models/User';
import { TestingElements } from 'src/test/mocks/TestingElements';
import { of, throwError } from 'rxjs';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';

// MOCKS
jest.mock("../../services/admin.service.ts");
jest.mock("src/app/services/auth.service");
jest.mock('src/app/pages/my-profile/my-profile.component');
jest.mock('../admin-user-details/admin-user-details.component');
jest.mock('src/app/guards/AdminGuard');
// jest.mock('@angular/material/dialog');

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let adminService: AdminService;
  let authService: AuthService;
  let getUsersSpy: any;
  let dialog: MatDialog;
  let _matSnackbar: MatSnackBar;

  let response: PagedResponse<User>;
  let users: User[] = [TestingElements.USER];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersComponent ],
      providers: [AdminService, AuthService],
      imports: [ BrowserAnimationsModule,
        MatFormFieldModule, MatDialogModule, MatDividerModule, MatPaginatorModule,
        MatSnackBarModule, MatChipsModule, MatTableModule, MatIconModule,
      RouterTestingModule.withRoutes([
        {path: 'admin', component: MyProfileComponent, children: [
          {path: 'users', component: UsersComponent},
          {path: 'user-details/:id', component: AdminUserDetailsComponent}
        ], canActivate: [AdminGuard]},
      ])]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService);
    authService = TestBed.inject(AuthService);
    dialog = TestBed.inject(MatDialog);
    _matSnackbar = TestBed.inject(MatSnackBar);

    response = {
      content: users,
      count: 1,
      totalCount: 1
    };

    getUsersSpy = jest.spyOn(adminService, 'getUsers').mockReturnValue(of(response));
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.detectChanges();
  })

  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setup component', () => {
    describe('ngOnInit', () => {
      it('should initialize dataSource', () => {
        component.ngOnInit();
        expect(getUsersSpy).toHaveBeenCalled();
        expect(component.dataSource).toEqual(users);
        expect(component.totalCount).toEqual(1);
      });

      it('should console log error', () => {
        let error = new Error('Users not found');
        let consoleLogSpy = jest.spyOn(console, 'log');
        getUsersSpy.mockReturnValue(throwError(error));

        component.ngOnInit();

        expect(consoleLogSpy).toHaveBeenCalledWith(error);
      });
    });
  });

  describe('loadUsers method', () => {
    const PAGE_EVENT = {
      pageIndex: 0, 
      pageSize: 1
    };

    const PAGE = 0;
    const SIZE = 1;

    it('should call the refreshUsers method and set the size and page properties', () => {
      let getUsersSpy = jest.spyOn(adminService, 'getUsers').mockReturnValue(of(response));

      component.loadUsers(PAGE_EVENT as PageEvent);

      expect(getUsersSpy).toHaveBeenCalledWith(PAGE, SIZE);
      expect(component.dataSource).toEqual([TestingElements.USER]);
      expect(component.totalCount).toEqual(1);
    });

    it('should console log an error', () => {
      let error = new Error('Not found');
      let getUsersSpy = jest.spyOn(adminService, 'getUsers').mockReturnValue(throwError(error));
      let consoleLogSpy = jest.spyOn(console, 'log');

      component.loadUsers(PAGE_EVENT as PageEvent);

      expect(getUsersSpy).toHaveBeenCalledWith(PAGE, SIZE);
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
    })
  });

  describe('openDialog method', () => {
    const NEW_USER = {...TestingElements.USER, id: 2};
    it('should close dialog and add user', () => {
      let dialogRef = {afterClosed: () => of(true)} as MatDialogRef<SignupDialogComponent>;
      const openSpy = jest.spyOn(dialog, 'open').mockReturnValue(dialogRef);
      const afterClosedSpy = jest.spyOn(dialogRef, 'afterClosed').mockReturnValue(of(TestingElements.USER_CREATE));
      const createUserSpy = jest.spyOn(authService, 'createUser').mockReturnValue(of(NEW_USER));
      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar');

      component.openDialog()
      expect(openSpy).toHaveBeenCalled();
      expect(afterClosedSpy).toHaveBeenCalled();
      expect(createUserSpy).toHaveBeenCalled();

      expect(component.dataSource).toEqual([TestingElements.USER, NEW_USER]);
      expect(component.totalCount).toEqual(2);
      expect(openSnackbarSpy).toHaveBeenCalledWith("User has been added!", "Dismiss");
    });

    it('should open snackbar with an error', () => {
      const error = new Error('Not Found');
      let dialogRef = {afterClosed: () => of(true)} as MatDialogRef<SignupDialogComponent>;
      const openSpy = jest.spyOn(dialog, 'open').mockReturnValue(dialogRef);
      const afterClosedSpy = jest.spyOn(dialogRef, 'afterClosed').mockReturnValue(of(TestingElements.USER_CREATE));
      const createUserSpy = jest.spyOn(authService, 'createUser').mockReturnValue(throwError(error));
      const openSnackbarSpy = jest.spyOn(component, 'openSnackbar');

      component.openDialog()
      expect(openSpy).toHaveBeenCalled();
      expect(afterClosedSpy).toHaveBeenCalled();
      expect(createUserSpy).toHaveBeenCalled();

      expect(openSnackbarSpy).toHaveBeenCalledWith("Something went wrong! Please try again!", "Dismiss");
    })
  });


  describe('openSnackbar method', () => {
    const MESSAGE = "Snackbar Action Message";
    const ACTION = "Dismiss";
    const DURATION = { duration: 3000 };
    
    it('should open the snackbar from the dependency injection', () => {
      let snackbarSpy = jest.spyOn(_matSnackbar, 'open');
      component.openSnackbar(MESSAGE, ACTION);

      expect(snackbarSpy).toHaveBeenCalledWith(MESSAGE, ACTION, DURATION);
    });
  });
  
});
