import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TestingElements } from '../../test/mocks/TestingElements';
import { Trip } from '../models/Trip';
import { User } from '../models/User';

import { AdminService } from './admin.service';

describe('AdminService', () => {
  let adminService: AdminService;
  let httpTestingController: HttpTestingController;
  let apiUri = 'http://localhost:8080/api/admin';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    adminService = TestBed.inject(AdminService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(adminService).toBeTruthy();
  });

  describe('get all users method', () => {
    const usersList: User[] = [
      { id: 1, username: 'albi', email: 'albitaulla@yahoo.com', roles: ['ROLE_USER']},
      { id: 2, username: 'jane', email: 'jane@test.com', roles: ['ROLE_ADMIN']}
    ];

    it('should return a list of all users', () => {
     adminService.getUsers(1,2).subscribe( users => {
       expect(users.content).toEqual(usersList);
     });

     let page = 1;
     let size = 2;
     let path = `${apiUri}/users?page=${page}&size=${size}`;
     const req = httpTestingController.expectOne(path);

     expect(req.request.method).toEqual('GET');

     req.flush(usersList);
    })

    it('should return an error message', () => {
      const errorMessage = 'Error!';

      adminService.getUsers(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER).subscribe(
        () => {},
        error => {
          expect(error.status).toEqual(404);
          expect(error.statusText).toEqual('Not found');
          expect(error.error).toEqual(errorMessage);
        }
      );

      let path = `${apiUri}/users?page=${Number.MAX_SAFE_INTEGER}&size=${Number.MAX_SAFE_INTEGER}`;
      const request = httpTestingController.expectOne(path);

      request.flush(errorMessage, {status: 404, statusText: 'Not found'});
    })
  })

  describe('update trip status method', () => {
    const TRIP_ID = 1;
    const NEW_STATUS = "APPROVED";
    const updatedTrip: Trip = {...TestingElements.TRIP, status: "APPROVED"};

    it('should return trip with updated status', () => {
      adminService.updateTripStatus(TRIP_ID, NEW_STATUS).subscribe(trip => {
        expect(trip).toEqual(updatedTrip);
        expect(trip.status).toEqual(NEW_STATUS);
      })

      let path = `${apiUri}/update-trip-status`;
      let requests = httpTestingController.match(request => {
        return request.url === path && request.body.id === TRIP_ID && request.body.status === NEW_STATUS;
      });

      expect(requests[0].request.method).toEqual('POST');
      requests[0].flush(updatedTrip);
    });

    it('should throw error trip not found', () => {
      let errorMessage = "Trip could not be found";

      adminService.updateTripStatus(TRIP_ID, NEW_STATUS).subscribe(
        () => {},
        error => {
          expect(error.status).toEqual(404);
          expect(error.statusText).toEqual('Not found');
          expect(error.error).toEqual(errorMessage);
        }
      );

      let path = `${apiUri}/update-trip-status`;
      let requests = httpTestingController.match(request => {
        return request.url === path && request.body.id === TRIP_ID && request.body.status === NEW_STATUS;
      });

      requests[0].flush(errorMessage, {status: 404, statusText: 'Not found'});
    })
  })
});
