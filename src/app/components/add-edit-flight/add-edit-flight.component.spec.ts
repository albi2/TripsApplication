import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { FlightService } from 'src/app/services/flight.service';
import { TestingElements } from 'src/test/mocks/TestingElements';
import { AddEditFlightComponent } from './add-edit-flight.component';

/**
 * MOCKS
 */
jest.mock('src/app/services/flight.service');

describe('AddEditFlightComponent', () => {
  let component: AddEditFlightComponent;
  let fixture: ComponentFixture<AddEditFlightComponent>;
  let flightService: FlightService;
  let _matSnackbar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditFlightComponent],
      imports: [
        MatSnackBarModule,
        FormsModule, ReactiveFormsModule, MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatStepperModule,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,
        BrowserAnimationsModule], 
      providers: [
        FlightService,
        MatDatepickerModule,
        MatNativeDateModule,
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'auto' } },
        NgxMatNativeDateModule
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFlightComponent);
    component = fixture.componentInstance;
    flightService = TestBed.inject(FlightService);
    _matSnackbar = TestBed.inject(MatSnackBar);
    component.tripId = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("setup component", () => {
    describe("ngOnInit method", () => {
      it('should set all form groups and they should be invalid or have initial values', () => {
          let flightClassControl = component.flightClassGroup.controls['flightClass'];
          let flightOriginControl = component.flightOriginGroup.controls['originCity'];
          let flightDestinationControl = component.flightDestinationGroup.controls['destinationCity'];
          let flightBoardingControl = component.flightBoardingGroup.controls['flightBoardingTime'];
          let flightDepartureDateControl = component.flightDepartureDateGroup.controls['flightDepartureDate'];
          let flightArrivalDateControl = component.flightArrivalDateGroup.controls['flightArrivalDate'];
          let flightPriceControl = component.flightPriceGroup.controls['flightPrice'];

          expect(flightClassControl.errors['required']).toBeTruthy();
          expect(flightOriginControl.errors['required']).toBeTruthy();
          expect(flightDestinationControl.errors['required']).toBeTruthy();
          expect(flightBoardingControl.value).toBeTruthy();
          expect(flightDepartureDateControl.value).toBeTruthy();
          expect(flightArrivalDateControl.value).toBeTruthy();
          expect(flightPriceControl.value).toEqual(0.0);
      });
    });
  });

 

  describe('addFlight method', () => {
    let flight = {...TestingElements.FLIGHT, id: null, departureDate: TestingElements.FLIGHT.departureDate.toISOString(),
      arrivalDate: TestingElements.FLIGHT.arrivalDate.toISOString() , boardingTime: TestingElements.FLIGHT.boardingTime.toISOString()};
    delete flight.id;

    const TRIP_ID = 1;

    it('should call getFlightFromFields method, use the service to save the flight and open the snackbar', () => {
      let getFlightClassSpy = jest.spyOn(component.flightClassGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.flightClass));
      let getFlightOriginSpy = jest.spyOn(component.flightOriginGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.fromCity));
      let getFlightDestinationSpy = jest.spyOn(component.flightDestinationGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.toCity));
      let getFlightBoardingTime = jest.spyOn(component.flightBoardingGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.boardingTime));
      let getFlightDepartureDate = jest.spyOn(component.flightDepartureDateGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.departureDate));
      let getFlightArrivalDate = jest.spyOn(component.flightArrivalDateGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.arrivalDate));
      let getFlightPrice = jest.spyOn(component.flightPriceGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.price));

      let postAddFlightSpy = jest.spyOn(flightService, 'postAddFlight').mockReturnValue(of(TestingElements.FLIGHT));
      let openSnackbarSpy = jest.spyOn(_matSnackbar, 'open');

      component.addFlight();
      
      component.onFlightAdded.subscribe(flight => {
        expect(flight).toEqual(TestingElements.FLIGHT);
      });
      expect(postAddFlightSpy).toHaveBeenCalledWith(TRIP_ID, flight);
      expect(openSnackbarSpy).toHaveBeenCalledWith("Flight created","Dismiss");
    });

    it('should console log error thrown from flightService', () => {
      let getFlightClassSpy = jest.spyOn(component.flightClassGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.flightClass));      let getFlightOriginSpy = jest.spyOn(component.flightOriginGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.fromCity));
      let getFlightDestinationSpy = jest.spyOn(component.flightDestinationGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.toCity));
      let getFlightBoardingTime = jest.spyOn(component.flightBoardingGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.boardingTime));
      let getFlightDepartureDate = jest.spyOn(component.flightDepartureDateGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.departureDate));
      let getFlightArrivalDate = jest.spyOn(component.flightArrivalDateGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.arrivalDate));
      let getFlightPrice = jest.spyOn(component.flightPriceGroup, 'get').mockReturnValue(new FormControl(TestingElements.FLIGHT.price));
      
      const error = new Error('Internal Server Error');
      let consoleErrorSpy = jest.spyOn(console, 'error');

      let postAddFlightSpy = jest.spyOn(flightService, 'postAddFlight').mockReturnValue(throwError(error));
      
      component.addFlight();
      expect(postAddFlightSpy).toHaveBeenCalledWith(TRIP_ID, flight);
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });
  });
});
