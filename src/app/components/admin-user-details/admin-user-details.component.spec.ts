import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminUserDetailsComponent } from './admin-user-details.component';
import { TestingElements } from 'src/test/mocks/TestingElements';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TripService } from '../../services/trip.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Trip } from 'src/app/models/Trip';

// jest.mock('../../shared/toggle/toggle.component.ts');
jest.mock('../../services/trip.service');

describe('AdminUserDetailsComponent', () => {
  let component: AdminUserDetailsComponent;
  let fixture: ComponentFixture<AdminUserDetailsComponent>;
  let tripService: TripService;
  let getTripsByUserIdSpy;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminUserDetailsComponent],
      imports: [RouterTestingModule.withRoutes([
        { path: '',   redirectTo: '/home', pathMatch: 'full' }
      ]),
      ],
      providers: [TripService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserDetailsComponent);
    component = fixture.componentInstance;

    tripService = TestBed.inject(TripService);
    route = TestBed.inject(ActivatedRoute);

    getTripsByUserIdSpy = jest.spyOn(tripService, 'getTripsByUserId').mockReturnValue(of([TestingElements.TRIP]));

    component.trips = [TestingElements.TRIP]
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setup component ngOnInit', () => {
    it('should set up component successfully', () => {
      let spyActiveRouteParam = jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue("1");

      component.ngOnInit();

      expect(getTripsByUserIdSpy).toHaveBeenCalledWith(1);
      expect(component.trips).toEqual([TestingElements.TRIP]);
    });

    it('should throw error', () => {
      const error = new Error('could not find trips!!');
      getTripsByUserIdSpy.mockReturnValue(throwError(error));
      let consoleLogSpy = jest.spyOn(console, 'log');

      component.ngOnInit();

      expect(consoleLogSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('update trip view method', () => {
    const updatedTrip: Trip = {...TestingElements.TRIP, status: 'ACCEPTED'};

    it('should update trip', () => {
        component.updateTripView(updatedTrip);

        expect(component.trips[0]).toEqual(updatedTrip);
    });
  });
});
