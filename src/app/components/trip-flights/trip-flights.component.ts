import { Component, OnInit } from '@angular/core';
import { Flight } from 'src/app/models/Flight';
import { FlightService } from 'src/app/services/flight.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { PagedResponse } from 'src/app/models/PagedResponse';
import { Trip } from 'src/app/models/Trip';
import { TripService } from 'src/app/services/trip.service';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-trip-flights',
  templateUrl: './trip-flights.component.html',
  styleUrls: ['./trip-flights.component.scss']
})
export class TripFlightsComponent implements OnInit {
  flights: Flight[];
  trip: Trip;
  tripId: number;
  errMessage: string = null;
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;

  constructor(private flightService: FlightService, private route: ActivatedRoute,
    private tripService: TripService) { }

  ngOnInit(): void {
    const tripId = Number(this.route.snapshot.paramMap.get("tripId"));
    this.tripId = tripId;
    this.tripService.getTripById(tripId).subscribe((res: Trip) => {
      this.trip = res;
      this.populateTrip();
    },
    err => {
      console.log(err);
    });
    this.flightService.getFlightsOfTrip(tripId).subscribe(
      (res: PagedResponse<Flight>) => {
        this.flights = res.content;
        this.totalCount = res.totalCount;
      },
      err => {
        console.log(err);
      }
    )
  }

  private populateTrip() {
    fetch("https://restcountries.eu/rest/v2/name/"+this.trip.toCountry).then(res => {
      return res.json();
     })
     .then( data => {
       if(data[0]) {
         this.trip.photo = data[0].flag;
         this.trip.toCountryCode = data[0].alpha3Code;
       }
       return fetch("https://restcountries.eu/rest/v2/name/" + this.trip.fromCountry);
     })
     .then(res => {
       return res.json();
     })
     .then(data => {
       if(data[0])
         this.trip.fromCountryCode = data[0].alpha3Code;
     });
  }

  loadFlights(event: PageEvent) {
    this.size =event.pageSize;
    this.page = event.pageIndex;

    this.refreshFlights(this.page, this.size);
    return event;
  }



  private refreshFlights(page?: number, size?: number) {
    this.flightService.getFlightsOfTrip(this.trip.id, page, size).subscribe((res: PagedResponse<Flight>) => {
      this.flights = !!res.content ? res.content : [];
      this.totalCount = !!res.totalCount ? res.totalCount : 0;
    },
    err => {
      console.log(err);
    });
  }

  addFlightToView(newFlight: Flight) {
    console.log(newFlight);
    if(this.flights.length < this.size) {
      this.flights.push(newFlight);
      this.flights = [...this.flights];
    }

    ++this.totalCount;
  }

  isCreated(): boolean {
    return this.trip.status === "CREATED";
  }

  isWaitingApproval(): boolean{
    return this.trip.status === "WAITING_FOR_APPROVAL";
  }

  isApproved(): boolean {
    return this.trip.status === "APPROVED";
  }

  changeStatusToWaiting() {
    this.tripService.requestApproval(this.tripId).subscribe(
      () => {
        this.trip = {...this.trip, status: "WAITING_FOR_APPROVAL"};
      },
      err => {
        console.log(err);
      }
    );
  }
  
}
