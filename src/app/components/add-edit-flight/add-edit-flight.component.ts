import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Flight } from 'src/app/models/Flight';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FlightService } from 'src/app/services/flight.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-edit-flight',
  templateUrl: './add-edit-flight.component.html',
  styleUrls: ['./add-edit-flight.component.scss']
})
export class AddEditFlightComponent implements OnInit {
  readonly flightClass: Object[] = [
    {value: 'ECONOMY', viewValue: 'Economy Class' },
    {value: 'FIRST', viewValue: 'First Class' },
    {value: 'BUSINESS', viewValue: 'Business Class' },
    {value:'PREMIUM', viewValue: 'Premium Class' },
  ];

  stepHour: number = 1;
  stepMinute: number = 1;
  stepSecond: number = 1;
  showSpinners: boolean = true;
  showSeconds: boolean = true;

  editingFlight?: Flight;
  isLinear: boolean = true;
  flightClassGroup: FormGroup;
  flightOriginGroup: FormGroup;
  flightDestinationGroup: FormGroup;
  flightBoardingGroup: FormGroup;
  flightDepartureDateGroup: FormGroup;
  flightArrivalDateGroup: FormGroup;
  flightPriceGroup: FormGroup;

  @Input() tripId: number;
  @Output() onFlightAdded = new EventEmitter<Flight>();

  constructor(private _formBuilder: FormBuilder,
    private flightService: FlightService,
    private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.flightClassGroup= this._formBuilder.group({
      flightClass: ['', Validators.required]
    });
    this.flightOriginGroup = this._formBuilder.group({
      originCity: ['', Validators.required]
    });
    this.flightDestinationGroup = this._formBuilder.group(
      {
        destinationCity: ['', Validators.required]
      }
    );
    this.flightBoardingGroup = this._formBuilder.group(
      {
        flightBoardingTime: [new Date(), Validators.required]
      }
    );
    this.flightDepartureDateGroup = this._formBuilder.group(
      {
        flightDepartureDate: [new Date(), Validators.required]
      }
    );
    this.flightArrivalDateGroup = this._formBuilder.group(
      {
        flightArrivalDate: [new Date(), Validators.required]
      }
    );
    this.flightPriceGroup = this._formBuilder.group({
      flightPrice: [0.0, Validators.required]
    });
  }

  private getflightFromFields(): Flight{
    let flightClass= this.flightClassGroup.get('flightClass').value;
    let flightOrigin = this.flightOriginGroup.get('originCity').value;
    let flightDestination = this.flightDestinationGroup.get('destinationCity').value; 
    let boardingTime = this.flightBoardingGroup.get('flightBoardingTime').value.toISOString();
    let departureDate = this.flightDepartureDateGroup.get('flightDepartureDate').value.toISOString();
    let arrivalDate = this.flightArrivalDateGroup.get('flightArrivalDate').value.toISOString();
    let price = Number(this.flightPriceGroup.get("flightPrice").value);
    
    const flight = { 
      fromCity: flightOrigin,
      toCity: flightDestination,
      departureDate: departureDate,
      arrivalDate: arrivalDate,
      boardingTime: boardingTime,
      flightClass: flightClass,
      price: price
    };

    return flight;
  }

  private openSnackbar(message: string, action: string) {
    this._snackbar.open(message, action);
  }
 
 addFlight() {
    const flight = this.getflightFromFields();

    this.flightService.postAddFlight(this.tripId, flight).subscribe( (flight: Flight) => {
      this.onFlightAdded.emit(flight);
      this.openSnackbar("Flight created","Dismiss");
    },
    err => {
      console.error(err);
    });
  }

}
