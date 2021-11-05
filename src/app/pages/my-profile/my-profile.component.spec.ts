import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { AuthService } from 'src/app/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

import { MyProfileComponent } from './my-profile.component';

/**
 * MOCKS
 */
jest.mock('src/app/services/auth.service');

describe('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyProfileComponent, SidebarComponent],
      providers: [AuthService],
      imports: [RouterTestingModule.withRoutes([
        // {path: 'home', component: HomepageComponent, canActivate: [GeneralUserGuard]},
        { path: '',   redirectTo: '/home', pathMatch: 'full' }
      ])],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleNavbar method', () => {
    it('should toggle navbar', () => {
      const bannerDe: DebugElement = fixture.debugElement;
      const toggle = bannerDe.query(By.css("#header-toggle")).nativeElement;
      const nav = bannerDe.query(By.css("#nav-bar")).nativeElement;
      const bodypd = bannerDe.query(By.css("#body-pd")).nativeElement;
      const headerpd = bannerDe.query(By.css("#header")).nativeElement;


      let navToggle = jest.spyOn(nav.classList, 'toggle');
      let toggleBtn = jest.spyOn(toggle.classList, 'toggle');
      let bodypdToggle = jest.spyOn(bodypd.classList, 'toggle');
      let headerpdToggle = jest.spyOn(headerpd.classList, 'toggle');

      component.toggleNavbar();
      expect(navToggle).toHaveBeenCalledWith('show');
      expect(toggleBtn).toHaveBeenCalledWith('bx-x');
      expect(bodypdToggle).toHaveBeenCalledWith('body-pd');
      expect(headerpdToggle).toHaveBeenCalledWith('body-pd');
    });
  });
});
