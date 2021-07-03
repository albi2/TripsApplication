import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { PagedResponse } from '../models/PagedResponse';
import { Flight } from '../models/Flight';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  readonly API_URI = "http://localhost:8080/api/flight"
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  } 
  constructor(private http: HttpClient) { }

  getFlightsOfTrip(tripId: number, page?: number, size?: number) {
    const suffix: string = (page !== undefined && size !== undefined) ? "?page="+page+"&size="+size: "";

    return this.http.get<PagedResponse<Flight>>(this.API_URI + "/" + tripId+suffix, this.httpOptions);
  }

  postAddFlight(tripId: number,flight: Flight) {
    return this.http.post<Flight>(this.API_URI+ "/add-flight/" + tripId, flight, this.httpOptions);
  }
}
