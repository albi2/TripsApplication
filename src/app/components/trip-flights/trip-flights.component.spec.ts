import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {  of, throwError } from 'rxjs';
import { GeneralUserGuard } from 'src/app/guards/GeneralUserGuard';
import { Flight } from 'src/app/models/Flight';
import { PagedResponse } from 'src/app/models/PagedResponse';
import HomepageComponent from 'src/app/pages/homepage/homepage.component';
import { FlightService } from 'src/app/services/flight.service';
import { TripService } from 'src/app/services/trip.service';
import { TestingElements } from 'src/test/mocks/TestingElements';
import { TripFlightsComponent } from './trip-flights.component';

/** 
 * MOCKS
 */
jest.mock('src/app/guards/GeneralUserGuard');
jest.mock('src/app/pages/homepage/homepage.component');
jest.mock('src/app/services/trip.service');
jest.mock('src/app/services/flight.service');



describe('TripFlightsComponent', () => {
  let component: TripFlightsComponent;
  let fixture: ComponentFixture<TripFlightsComponent>;
  let getTripByIdSpy;
  let tripService: TripService;
  let flightService: FlightService;
  let activatedRoute: ActivatedRoute;
  let response: PagedResponse<Flight>;
  let getFlightsOfTripSpy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripFlightsComponent ],
      imports: [ReactiveFormsModule, FormsModule, 
        RouterTestingModule.withRoutes([
          {path: 'home', component: HomepageComponent, canActivate: [GeneralUserGuard]},
          { path: '',   redirectTo: '/home', pathMatch: 'full' }
        ])],
      providers: [FlightService, TripService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeAll(() => {
    // global.fetch = jest.fn(() =>
    //     Promise.resolve({
    //       json: () => Promise.resolve([]),
    //     }) 
    //   );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripFlightsComponent);
    component = fixture.componentInstance;
    tripService = TestBed.inject(TripService);
    flightService = TestBed.inject(FlightService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    getTripByIdSpy = jest.spyOn(tripService, 'getTripById').mockReturnValue(of(TestingElements.TRIP));

    response = {
      content: [TestingElements.FLIGHT],
      count: 1,
      totalCount: 1
    }
    getFlightsOfTripSpy = jest.spyOn(flightService, 'getFlightsOfTrip').mockReturnValue(of(response));

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("setup component", () => {
    let body = [
      {
        flag: "FLAG",
        alpha3Code: "CODE"
      }
    ];
    describe("ngOnInit method", () => {
      const TRIP_ID = 1;

      it('should initialize the current trip and the flights for that trip', () => {
        let getRouteParamSpy = jest.spyOn(activatedRoute.snapshot.paramMap, 'get').mockReturnValue(new Number(TRIP_ID).toString());
        window.fetch = jest.fn(() => new Promise<any>((resolve, reject) => resolve(
          {
            json:()=>{
               return JSON.stringify(body);
            }
          }
       )));

      
        component.ngOnInit();

        expect(getRouteParamSpy).toHaveBeenCalledWith("tripId");
        expect(getTripByIdSpy).toHaveBeenCalledWith(TRIP_ID);
        expect(component.trip).toEqual(TestingElements.TRIP);
        expect(component.trip.photo).not.toBeNull();
        expect(component.trip.fromCountryCode).not.toBeNull();
        expect(component.trip.toCountryCode).not.toBeNull();

        expect(getFlightsOfTripSpy).toHaveBeenCalledWith(TRIP_ID);
        expect(component.flights).toEqual(response.content);
        expect(component.totalCount).toEqual(1);

        expect(fetch).toHaveBeenCalled();
      });

      it('should console log errors from the services', () => {
        const flightError = new Error("Flight error!");
        const tripError = new Error("Trip error!");
        getFlightsOfTripSpy.mockReturnValue(throwError(flightError));
        getTripByIdSpy.mockReturnValue(throwError(tripError));
        let consoleLogSpy = jest.spyOn(console, 'log');

        component.ngOnInit();

        expect(consoleLogSpy).toHaveBeenCalledTimes(2);
        expect(consoleLogSpy).toHaveBeenCalledWith(tripError);
        expect(consoleLogSpy).toHaveBeenCalledWith(flightError);
      });
    });
  });

  describe("loadFlights method", () => {
    const PAGE_EVENT = {
      pageIndex: 0, 
      pageSize: 1
    } as PageEvent;

    const nextResponse: PagedResponse<Flight> = {
      content: [{...TestingElements.FLIGHT, id: 2,  fromCity: "Rome"}],
      count: 1,
      totalCount: 1
    };

    const PAGE = 0;
    const SIZE = 1;

    const TRIP_ID = 1;

    it('should refresh flights according to page and size', () => {
      getFlightsOfTripSpy.mockReturnValue(of(nextResponse));

      let result = component.loadFlights(PAGE_EVENT);
      // fixture.detectChanges();

      expect(result).toEqual(PAGE_EVENT);
      expect(getFlightsOfTripSpy).toHaveBeenCalledWith(TRIP_ID, PAGE, SIZE);
      expect(component.flights).toEqual(nextResponse.content);
    });

    it('should fail due to flight service throwing error', () => {
      const error = new Error("Trip error");
      getFlightsOfTripSpy.mockReturnValue(throwError(error));
      let consoleLogSpy = jest.spyOn(console, 'log');

      component.loadFlights(PAGE_EVENT);

      expect(consoleLogSpy).toHaveBeenCalledWith(error);
    });
  });

  describe("addFlightToView method", () => {
    const newFlight: Flight = {...TestingElements.FLIGHT, id: 2};

    it('should add new flight to data source and increase totalCount', () => {
      component.addFlightToView(newFlight);
      
      expect(component.flights).toEqual([TestingElements.FLIGHT, newFlight]);
      expect(component.totalCount).toEqual(2);
    })
  });

  describe("isCreated method", () => {
    it('should return true', () => {
      
      const result: boolean = component.isCreated();

      expect(result).toEqual(true);
    });

    it('should return false', () => {
      component.trip.status = "WAITING_FOR_APPROVAL";
      fixture.detectChanges();
      const result = component.isCreated();
      expect(result).toEqual(false);
    });
  });

  describe("isWaitingForApproval method", () => {
    it('should return true', () => {
      component.trip.status = "WAITING_FOR_APPROVAL";
      fixture.detectChanges();
      const result = component.isWaitingApproval();
      expect(result).toEqual(true);
    });

    it('should return false', () => {
      component.trip.status = "CREATED";
      fixture.detectChanges();
      const result = component.isWaitingApproval();
      expect(result).toEqual(false);
    });
  
  });

  describe("isApproved method", () => {
    it("should return true", () => {
      component.trip.status = "APPROVED";
      fixture.detectChanges();
      const result = component.isApproved();
      expect(result).toEqual(true);
    });

    it("should return false", () => {
      const result = component.isApproved();
      expect(result).toEqual(true);
    });
  });

  describe("changeStatusToWaiting method", () => {
    it('should change trip status to waiting for approval', () => {
      component.tripId = component.trip.id;
      fixture.detectChanges();
      let requestApprovalSpy = jest.spyOn(tripService, "requestApproval").mockReturnValue(of("Message"));

      component.changeStatusToWaiting();

      expect(requestApprovalSpy).toHaveBeenCalledWith(1);
      expect(component.trip.status).toEqual("WAITING_FOR_APPROVAL");
    });

    it('should throw error', () => {
      component.tripId = component.trip.id;
      fixture.detectChanges();
      let requestApprovalSpy = jest.spyOn(tripService, "requestApproval");
      let error = new Error("Status change error");
      let consoleLogSpy = jest.spyOn(console, 'log');
      requestApprovalSpy.mockReturnValue(throwError(error));

      component.changeStatusToWaiting();

      expect(requestApprovalSpy).toHaveBeenCalledWith(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
    });
  });
});
