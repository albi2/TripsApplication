import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TripService } from './trip.service';
import { Trip } from '../models/Trip';
import { TestingElements } from 'src/test/mocks/TestingElements';
import { PagedResponse } from '../models/PagedResponse';
import { isEqual } from 'lodash';

describe('TripService', () => {
  let tripService: TripService;
  let apiUri = "http://localhost:8080/api/trip";
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    tripService = TestBed.inject(TripService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(tripService).toBeTruthy();
  });

  describe('getTrips method', () => {
    const tripList: Trip[] = [
      TestingElements.TRIP,
      {...TestingElements.TRIP, id: 2}
    ];
    const PAGE = 0;
    const SIZE = 2;

    it('should return a list of trips', () => {
      const response: PagedResponse<Trip> = {
        content: tripList,
        count: 2,
        totalCount: 2
      };

      tripService.getTrips(PAGE,SIZE).subscribe(trips => {
        expect(trips).toEqual(response);
      });

      const path = `${apiUri}?size=${SIZE}&page=${PAGE}`;
      let request = httpTestingController.expectOne(path);

      expect(request.request.method).toEqual('GET');

      request.flush(response);
    });

    it('should return a list of trips default sizes', () => {
      const response: PagedResponse<Trip> = {
        content: tripList,
        count: 2,
        totalCount: 2
      };

      tripService.getTrips().subscribe(trips => {
        expect(trips).toEqual(response);
      });

      const path = `${apiUri}`;
      let request = httpTestingController.expectOne(path);

      expect(request.request.method).toEqual('GET');

      request.flush(response);
    });
  });

  describe('postDeleteTrip method', () => {
    const TRIP_ID = 1;

    it('should return deleted trip', () => {
      
      tripService.postDeleteTrip(TRIP_ID).subscribe(trip => {
        expect(trip).toEqual(TestingElements.TRIP);
      });

      const path = `${apiUri}/delete-trip`;
      let requests = httpTestingController.match(request => {
        return (request.url === path && request.body.tripId === TRIP_ID);
      });

      expect(requests[0].request.method).toEqual('POST');

      requests[0].flush(TestingElements.TRIP);
    });
  });

  describe('postAddTrip method', () => {
    const TO_SAVE_TRIP = {...TestingElements.TRIP, id: null};

    it('should return the saved trip', () => {

      tripService.postAddTrip(TO_SAVE_TRIP).subscribe(savedTrip => {
        expect(savedTrip).toEqual(TestingElements.TRIP);
      });

      const path = `${apiUri}/add-trip`;
      let requests = httpTestingController.match(request => { 
        return (request.url === path && isEqual(request.body, TO_SAVE_TRIP));
      })

      expect(requests[0].request.method).toEqual('POST');

      requests[0].flush(TestingElements.TRIP);
    });
  });

  describe('postEditTrip method', () => {
    const EDIT_TRIP = {...TestingElements.TRIP, fromCountry: 'Italy'};

    it('should return edited trip', () => {
      tripService.postEditTrip(EDIT_TRIP).subscribe(updatedTrip => {
        expect(updatedTrip).toEqual(EDIT_TRIP);
      });

      const path = `${apiUri}/update-trip`;
      let requests = httpTestingController.match(request => {
        return (request.url === path && isEqual(request.body, EDIT_TRIP));
      });

      expect(requests[0].request.method).toEqual('POST');

      requests[0].flush(EDIT_TRIP);
    });
  });

  describe('getTripsByUserId method', () => {
    const tripList: Trip[] = [
      TestingElements.TRIP,
      {...TestingElements.TRIP, id: 2}
    ];
    const USER_ID = 1;

    it('should return a list of trips', () => {
      tripService.getTripsByUserId(USER_ID).subscribe(trips => {
        expect(trips).toEqual(tripList);
      });

      const path = `${apiUri}/all-trips-by-user/${USER_ID}`;
      let request = httpTestingController.expectOne(path);

      expect(request.request.method).toEqual('GET');

      request.flush(tripList);
    });
  });

  describe('getTripById method', () => {
    const TRIP_ID = 1;
    it('should return a trip', () => {
      tripService.getTripById(TRIP_ID).subscribe(trip => {
        expect(trip).toEqual(TestingElements.TRIP);
      });

      const path = `${apiUri}/${TRIP_ID}`;
      let request = httpTestingController.expectOne(path);

      expect(request.request.method).toEqual('GET');

      request.flush(TestingElements.TRIP);
    });
  });

  describe('requestApproval method', () => {
    const TRIP_ID = 1;
    const MESSAGE = "Trip status has been updated to WAITING_FOR_APPROVAL";

    it('should return message', () => {
      tripService.requestApproval(TRIP_ID).subscribe(message => {
        expect(message).toEqual(MESSAGE);
      });

      const path = `${apiUri}/requestApproval`;
      let requests = httpTestingController.match(request => {
        return (request.url === path && request.body.id === TRIP_ID);
      });

      expect(requests[0].request.method).toEqual('POST');

      requests[0].flush(MESSAGE);
    });
  });

});
