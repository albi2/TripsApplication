import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip.service';
import { Trip } from 'src/app/models/Trip';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-user-details',
  templateUrl: './admin-user-details.component.html',
  styleUrls: ['./admin-user-details.component.scss']
})
export class AdminUserDetailsComponent implements OnInit {
  trips: Trip[] = [];

  constructor(private tripService: TripService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
      const selectedId = Number(this.route.snapshot.paramMap.get("id"));

      this.tripService.getTripsByUserId(selectedId).subscribe( (res: Trip[]) => {
        this.trips= res;
      },
      err => {
        console.log(err);
      });
  }

  updateTripView(updatedTrip: Trip) {
    let updatedTripIndex = this.trips.findIndex(trip => trip.id === updatedTrip.id);
    let newTrips: Trip[] = [...this.trips];
    newTrips[updatedTripIndex] = updatedTrip;
    this.trips = newTrips;
  }
}
