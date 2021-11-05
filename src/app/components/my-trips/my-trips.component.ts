import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PagedResponse } from 'src/app/models/PagedResponse';
import { Trip } from 'src/app/models/Trip';
import { TripService } from 'src/app/services/trip.service';
import { AddEditTripStubComponent } from 'src/test/stubs/add-edit-trip-stub.component';
import { AddEditTripComponent } from '../add-edit-trip/add-edit-trip.component';

@Component({
  selector: 'app-my-trips',
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.scss']
})
export class MyTripsComponent implements OnInit {
  trips: Trip[];
  errMessage: string = null;
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;

  @ViewChild(AddEditTripComponent, {static: false}) public formComponent: AddEditTripComponent;

  constructor(private tripService: TripService) { }

  ngOnInit(): void {
    
    this.tripService.getTrips().subscribe(
      (res: PagedResponse<Trip>) => {
        this.trips = res.content;
        this.totalCount = res.totalCount;
        this.populateTrips();
      },
      err => {
        console.log(err);
        this.errMessage = "Could not load trips!";
      }
    )
  }

  private populateTrips() {
    this.trips.forEach(trip => {
      fetch("https://restcountries.eu/rest/v2/name/"+trip.toCountry).then(res => {
       return res.json();
      })
      .then( data => {
        if(data[0]) {
          trip.photo = data[0].flag;
          trip.toCountryCode = data[0].alpha3Code;
        }
        return fetch("https://restcountries.eu/rest/v2/name/" + trip.fromCountry);
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if(data[0])
          trip.fromCountryCode = data[0].alpha3Code;
      });
    });
  }

  public deleteTrip(tripId: number) {
    this.trips = this.trips.filter(trip => trip.id != tripId);
  }

  public updateTrip(trip: Trip) {
    let index: number = this.trips.findIndex(t => t.id === trip.id);
    let newTrips: Trip[] = [...this.trips];
    trip.photo = newTrips[index].photo;
    newTrips[index] = trip;
    this.trips = newTrips;
  }

  public addTripToView(trip: Trip) {
    this.trips.push(trip);
  }

  public activateEditTrip(trip: Trip) {
    this.formComponent.enableEditTrip(trip);
  }

  loadTrips(event: PageEvent) {
    this.size =event.pageSize;
    this.page = event.pageIndex;

    this.refreshTrips(this.page, this.size);
    return event;
  }

  private refreshTrips(page?: number, size?: number) {
    this.tripService.getTrips(page, size).subscribe((res: PagedResponse<Trip>) => {
      this.trips = !!res.content ? res.content : [];
      this.totalCount = !!res.totalCount ? res.totalCount : 0;
      this.populateTrips();
    },
    err => {
      console.log(err);
    });
  }
}
