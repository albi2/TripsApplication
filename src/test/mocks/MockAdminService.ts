import { Observable } from "rxjs";
import { Trip } from "../../app/models/Trip";
import { TestingElements } from "./TestingElements";

export class MockAdminService {
    public updateTripStatus(tripId: number, newStatus: string) {
        return new Observable<Trip>(observer => {
          observer.next({...TestingElements.TRIP, status: newStatus});
        });
      }
}