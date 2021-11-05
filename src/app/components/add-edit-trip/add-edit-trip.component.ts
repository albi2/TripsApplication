import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { TripService } from 'src/app/services/trip.service';
import { Trip } from 'src/app/models/Trip';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-edit-trip',
  templateUrl: './add-edit-trip.component.html',
  styleUrls: ['./add-edit-trip.component.scss'],
})
export class AddEditTripComponent implements OnInit {
  readonly tripReasons: Object[] = [
    { value: 'MEETING', viewValue: 'Meeting' },
    { value: 'TRAINING', viewValue: 'Training' },
    { value: 'PROJECT', viewValue: 'Project' },
    { value: 'WORKSHOP', viewValue: 'Workshop' },
    { value: 'EVENT', viewValue: 'Event' },
    { value: 'OTHER', viewValue: 'Other' }
  ];

  countries: string[] = [];

  editingTrip?: Trip;
  isLinear: boolean = true;
  tripReasonGroup: FormGroup;
  tripOriginGroup: FormGroup;
  tripDestinationGroup: FormGroup;
  tripDescriptionGroup: FormGroup;
  tripDepartureDateGroup: FormGroup;
  tripArrivalDateGroup: FormGroup;

  @Output() onTripAdded = new EventEmitter<Trip>();
  @Output() onTripUpdated = new EventEmitter<Trip>();

  constructor(private _formBuilder: FormBuilder, private _tripService: TripService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    fetch("https://restcountries.eu/rest/v2/all")
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.countries = data.map(country => country.name);
      });

    this.tripReasonGroup = this._formBuilder.group({
      tripReason: ['', Validators.required]
    });
    this.tripOriginGroup = this._formBuilder.group({
      originCountry: ['', Validators.required]
    });
    this.tripDestinationGroup = this._formBuilder.group(
      {
        destinationCountry: ['', Validators.required]
      }
    );
    this.tripDescriptionGroup = this._formBuilder.group(
      {
        tripDescription: ['', Validators.required]
      }
    );
    this.tripDepartureDateGroup = this._formBuilder.group(
      {
        tripDepartureDate: [new Date()]
      }
    );
    this.tripArrivalDateGroup = this._formBuilder.group(
      {
        tripArrivalDate: [new Date()]
      }
    );
  }

  private getTripFromFields(): Trip {
    let tripReason = this.tripReasonGroup.get('tripReason').value;
    let tripOrigin = this.tripOriginGroup.get('originCountry').value;
    let tripDestination = this.tripDestinationGroup.get('destinationCountry').value;
    let description = this.tripDescriptionGroup.get('tripDescription').value;
    let departureDate = this.tripDepartureDateGroup.get('tripDepartureDate').value.toISOString();
    let arrivalDate = this.tripArrivalDateGroup.get('tripArrivalDate').value.toISOString();
    
    const trip = {
      reason: tripReason,
      description: description,
      fromCountry: tripOrigin,
      toCountry: tripDestination,
      departureDate: departureDate,
      arrivalDate: arrivalDate,
    };

    return trip;
  }

  addTrip() {
    const trip = this.getTripFromFields();

    this._tripService.postAddTrip(trip).subscribe((trip: Trip) => {
      this.onTripAdded.emit(trip);
      this.openSnackbar("Trip created", "Dismiss");
    },
      err => {
        console.log(err);
      });
  }

  public enableEditTrip(trip: Trip) {
    this.isLinear = false;
    this.tripReasonGroup.setValue({
      tripReason: trip.reason
    });
    this.tripDescriptionGroup.setValue({
      tripDescription: trip.description
    });
    this.tripOriginGroup.setValue({
      originCountry: trip.fromCountry
    });
    this.tripDestinationGroup.setValue({
      destinationCountry: trip.toCountry
    });
    this.tripDepartureDateGroup.setValue({
      tripDepartureDate: new Date(trip.departureDate)
    });
    this.tripArrivalDateGroup.setValue({
      tripArrivalDate: new Date(trip.arrivalDate)
    });
    this.editingTrip = trip;
  }


  public editTrip() {
    const trip = this.getTripFromFields();
    trip.id = this.editingTrip.id;
    this._tripService.postEditTrip(trip).subscribe((res: Trip) => {
      this.onTripUpdated.emit(res);
      this.isLinear = true;
      this.openSnackbar("Trip updated", "Dismiss");
    },
    err => {
      console.log(err);
    });
  }

  private openSnackbar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }
}
