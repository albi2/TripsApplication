import { Component, OnInit,Input,Output } from '@angular/core';
import { Trip } from 'src/app/models/Trip';
import { TripService } from 'src/app/services/trip.service';
import { EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.scss']
})
export class TripCardComponent implements OnInit {
  @Input() trip: Trip = null;
  @Output() tripDeleted  = new EventEmitter<number>();
  @Output() enableEdit = new EventEmitter<Trip>();

  constructor(private tripService: TripService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  deleteTrip(tripId: number) {
    this.tripService.postDeleteTrip(tripId)
    .subscribe(res => {
      this.tripDeleted.emit(tripId);
      // Process response message
      this.openSnackbar("Trip was deleted!", "Dismiss");
    },
    err => {
      // Process error
      console.log(err);
    });
  }

  enableEditing() {
    this.enableEdit.emit(this.trip);
  }

  public openSnackbar(message: string, action: string) {
    this._snackBar.open(message,action, {
      duration: 3000
    });
  }
}
