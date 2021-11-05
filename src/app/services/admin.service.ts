import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User';
import { Trip } from '../models/Trip';
import { PagedResponse } from '../models/PagedResponse';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  readonly API_URI = "http://localhost:8080/api/admin";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  public getUsers(page?: number, size?: number) {
    const suffix: string = (page !== undefined && size !== undefined) ? "?page=" + page + "&size=" + size : "";
    return this.http.get<PagedResponse<User>>(this.API_URI + "/users" + suffix);
  }

  public updateTripStatus(tripId: number, newStatus: string) {
    return this.http.post<Trip>(this.API_URI + "/update-trip-status", { id: tripId, status: newStatus }, this.httpOptions);
  }
}
