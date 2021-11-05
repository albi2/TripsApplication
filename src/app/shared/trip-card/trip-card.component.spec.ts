import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TripService } from 'src/app/services/trip.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TripCardComponent } from './trip-card.component';
import { MatMenuModule } from '@angular/material/menu';
import { TestingElements } from 'src/test/mocks/TestingElements';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('TripCardComponent', () => {
  let component: TripCardComponent;
  let fixture: ComponentFixture<TripCardComponent>;
  let tripService: TripService;

  class MockProfileComponent{ }
  class MockTripFlightsComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, RouterTestingModule.withRoutes([
        {path: 'myProfile', component: MockProfileComponent, children: [
          {path: 'trip/:tripId/flights', component: MockTripFlightsComponent}
        ]},
      ]),
       MatButtonModule, MatChipsModule, MatIconModule, MatMenuModule, HttpClientModule
      ],
      declarations: [ TripCardComponent],
      providers: [
        TripService
      ]
    })
    .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(TripCardComponent);
    component = fixture.componentInstance;
    tripService = TestBed.inject(TripService);

    component.trip = TestingElements.TRIP;
    fixture.detectChanges();
  });

  describe("Test deleting a trip", () => {
    describe("deleteTrip", () => {

      it("should delete trip, emit id of deleted trip and open a snackbar", () => {
        const TRIP_ID = 1;
        const postDeleteTripSpy = jest.spyOn(tripService, "postDeleteTrip").mockReturnValue(of(TestingElements.TRIP));
        const openSnackbarSpy = jest.spyOn(component, "openSnackbar");

        component.deleteTrip(TRIP_ID);

        expect(postDeleteTripSpy).toHaveBeenCalledWith(TRIP_ID);
        component.tripDeleted.subscribe(deletedTripId => {
          expect(deletedTripId).toEqual(TRIP_ID);
        });
        expect(openSnackbarSpy).toHaveBeenCalled();
      });

      it("should throw error when trying to delete trip", () => {
        const TRIP_ID = 1;
        const error = new Error(TestingElements.ERROR_MESSAGE_TRIP);
        const postDeleteTripSpy = jest.spyOn(tripService, "postDeleteTrip").mockReturnValue(throwError(error));
        const consoleLogSpy = jest.spyOn(console, 'log');

        component.deleteTrip(TRIP_ID);
        expect(postDeleteTripSpy).toHaveBeenCalledWith(TRIP_ID);
        expect(consoleLogSpy).toHaveBeenCalledWith(error);
      })
    })
  })

  describe("Test enabling editing of the displayed trip", () => {
    describe("enableEditing", () => {
      it("should emit the current trip", () => {
        component.enableEditing();

        component.enableEdit.subscribe(trip => {
          expect(trip).toEqual(TestingElements.TRIP);
        });
      })
    })
  })
});
