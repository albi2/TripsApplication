import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FlightService } from './flight.service';
import { TestingElements } from 'src/test/mocks/TestingElements';
import { PagedResponse } from '../models/PagedResponse';
import { Flight } from '../models/Flight';
import { isEqual } from 'lodash';

describe('FlightService', () => {
  let flightService: FlightService;
  let httpTestingController: HttpTestingController;
  const apiUri: string = "http://localhost:8080/api/flight";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    flightService = TestBed.inject(FlightService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(flightService).toBeTruthy();
  });

  describe('getFlightsOfTrip method', () => {
    const flights = [
      TestingElements.FLIGHT,
      {...TestingElements.FLIGHT, id: 2}
    ];
    const TRIP_ID = 1;
    const PAGE = 0;
    const SIZE = 2;

    it('should return all flights for the trip', () => {
      const response: PagedResponse<Flight> ={
        content: flights,
        count: 2,
        totalCount: 2
      };

      flightService.getFlightsOfTrip(TRIP_ID, PAGE, SIZE).subscribe(tripsPage => {
        expect(tripsPage.content).toEqual(flights);
        expect(tripsPage.count).toEqual(2);
        expect(tripsPage.totalCount).toEqual(2);
      });

      const path = `${apiUri}/${TRIP_ID}?page=${PAGE}&size=${SIZE}`;
      let request = httpTestingController.expectOne(path);

      expect(request.request.method).toEqual('GET');

      request.flush(response);
    })
  });

  describe('postAddFlight', () => {
    const TRIP_ID = 1;

    it('should return save and return a Flight that belongs to the trip', () => {
      flightService.postAddFlight(TRIP_ID, {...TestingElements.FLIGHT, id: null }).subscribe(
        flight => {
          expect(flight).toEqual(TestingElements.FLIGHT);
        }
      );

      const path = `${apiUri}/add-flight/${TRIP_ID}`;
      let requests = httpTestingController.match(request => {
        return (request.url === path && isEqual(request.body, {...TestingElements.FLIGHT, id: null}));
      });

      expect(requests[0].request.method).toEqual('POST');

      requests[0].flush(TestingElements.FLIGHT);
    })
  })
});
