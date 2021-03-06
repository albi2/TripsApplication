import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trip } from '../models/Trip';
import { PagedResponse } from '../models/PagedResponse';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  readonly API_URI = "http://localhost:8080/api/trip";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  } 

  constructor(private http: HttpClient) { }

  public getTrips(page?: number, size?: number){
    const suffix: string = (page !== undefined && size !== undefined) ? "?size="+ size + "&page=" + page : "";
    return this.http.get<PagedResponse<Trip>>(this.API_URI+ suffix, this.httpOptions);
  }

  public postDeleteTrip(tripId: number) {
    return this.http.post(this.API_URI + "/delete-trip", {tripId},this.httpOptions);
  }

  public postAddTrip(trip: Object) {
    return this.http.post<Trip>(this.API_URI + "/add-trip", trip, this.httpOptions);
  }

  public postEditTrip(updatedTrip: Trip) {
    return this.http.post<Trip>(this.API_URI + "/update-trip", updatedTrip,this.httpOptions);
  }

  public getTripsByUserId(id: number) {
    return this.http.get<Trip[]>(this.API_URI + "/all-trips-by-user/" +id,this.httpOptions);
  }

 public getTripById(id: number) {
   return this.http.get<Trip>(this.API_URI + "/" + id, this.httpOptions);
 }

 public requestApproval(tripId: number) {
   return this.http.post(this.API_URI+"/requestApproval", {id: tripId}, this.httpOptions);
 }

}
