import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { of, throwError } from 'rxjs';
import { PagedResponse } from 'src/app/models/PagedResponse';
import { Trip } from 'src/app/models/Trip';
import { TripService } from 'src/app/services/trip.service';
import { TestingElements } from 'src/test/mocks/TestingElements';
import { AddEditTripStubComponent } from 'src/test/stubs/add-edit-trip-stub.component';
import { MyTripsComponent } from './my-trips.component';

/**
 * MOCKS
 */
jest.mock('src/app/services/trip.service');
jest.mock('src/app/shared/trip-card/trip-card.component');
jest.mock('../add-edit-trip/add-edit-trip.component');
// jest.mock('src/app/shared/trip-card/trip-card.component');

describe('MyTripsComponent', () => {
  let component: MyTripsComponent;
  let fixture: ComponentFixture<MyTripsComponent>;
  let tripService: TripService;
  let response: PagedResponse<Trip>;
  let getTripsSpy: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTripsComponent, AddEditTripStubComponent],
      providers: [ TripService ],
      imports: [ MatStepperModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTripsComponent);
    component = fixture.componentInstance;
    tripService = TestBed.inject(TripService);

    response = {
      content: [TestingElements.TRIP],
      count: 1,
      totalCount: 1
    };
    getTripsSpy = jest.spyOn(tripService, 'getTrips').mockReturnValue(of(response));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setup component', () => {
    describe('ngOnInit method', () => {
      let body = [
        {
          flag: "FLAG",
          alpha3Code: "CODE"
        }
      ];

      it('should set up properties and populate trips with more information', () => {
        window.fetch = jest.fn(() => new Promise<any>((resolve, reject) => resolve(
          {
            json:()=>{
               return JSON.stringify(body);
            }
          }
       )));

        component.ngOnInit();

        expect(getTripsSpy).toHaveBeenCalled();
        expect(component.trips).toEqual(response.content);
        expect(component.totalCount).toEqual(response.totalCount);
        expect(fetch).toHaveBeenCalled();
        component.trips.forEach(trip =>  {
          expect(trip.photo).not.toBeNull();
          expect(trip.fromCountryCode).not.toBeNull();
          expect(trip.toCountryCode).not.toBeNull();
        });
      });

      it('should console log error from the trip service', () => {
        const error = new Error("Trip Service Internal Error!");

        getTripsSpy.mockReturnValue(throwError(error));
        let consoleLogSpy = jest.spyOn(console, 'log');

        component.ngOnInit();

        expect(getTripsSpy).toHaveBeenCalled();
        expect(consoleLogSpy).toHaveBeenCalledWith(error);
        expect(component.errMessage).toEqual("Could not load trips!");
      });
    });
  });

  describe('deleteTrip method', () => {
    it('should delete the trip', () => {
      component.deleteTrip(1);

      expect(component.trips).toEqual([]);
    });
  });

  describe('updateTrip method', () => {
    const UPDATED_TRIP: Trip = {...TestingElements.TRIP, reason: 'WORK'};

    it('should update the trip in the trips property', () => {
      component.updateTrip(UPDATED_TRIP);
      expect(component.trips[0]).toEqual(UPDATED_TRIP);
      expect(component.trips[0].reason).toEqual('WORK');
    })
  });

  describe('addTripToView method', () => {
    const NEW_TRIP = {...TestingElements.TRIP, id: 2};

    it('should add new trip to the view', () => {
      component.addTripToView(NEW_TRIP);
      expect(component.trips.length).toEqual(2);
      expect(component.trips[component.trips.length-1]).toEqual(NEW_TRIP);
    });
  });

  describe('activateEditTrip method', () => {
    it('should call enable edit trip method on the form component', () => {
      let enableEditTripSpy = jest.spyOn(component.formComponent, 'enableEditTrip');
      component.activateEditTrip(TestingElements.TRIP);
      expect(enableEditTripSpy).toHaveBeenCalledWith(TestingElements.TRIP);
    });
  });

  describe('loadTrips method', () => {
    let event = {
      pageSize: 1,
      pageIndex: 0
    } as PageEvent;

    let body = [
      {
        flag: "FLAG",
        alpha3Code: "CODE"
      }
    ];

    it('should call the refresh trips method', () => {
      window.fetch = jest.fn(() => new Promise<any>((resolve, reject) => resolve(
        {
          json:()=>{
              return JSON.stringify(body);
          }
        }
      )));
      getTripsSpy.mockReturnValue(of(response));

      let result = component.loadTrips(event);

      expect(result).toEqual(event);
      expect(getTripsSpy).toHaveBeenCalledWith(event.pageIndex, event.pageSize);
      expect(component.trips).toEqual(response.content);
      expect(component.totalCount).toEqual(response.totalCount);
      expect(component.trips).toBeTruthy();
    });

    it('should console log error', () => {
      let error = new Error('Internal Server Error!');
      getTripsSpy.mockReturnValue(throwError(error));
      let consoleLogSpy = jest.spyOn(console, 'log');
      component.loadTrips(event);

      expect(getTripsSpy).toHaveBeenCalledWith(event.pageIndex, event.pageSize);
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
    });
  });

});
