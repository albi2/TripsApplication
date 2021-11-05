import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { TripService } from 'src/app/services/trip.service';
import { AddEditTripComponent } from './add-edit-trip.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestingElements } from 'src/test/mocks/TestingElements';
import { of, throwError } from 'rxjs';
 
/** MOCKS */
jest.mock('src/app/services/trip.service');

describe('AddEditTripComponent', () => {
  let component: AddEditTripComponent;
  let fixture: ComponentFixture<AddEditTripComponent>;
  let tripService: TripService;
  let snackbar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        BrowserAnimationsModule,
        BrowserModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatSelectModule,
        MatInputModule,
        MatNativeDateModule
      ],
      declarations: [ AddEditTripComponent ],
      providers: [TripService,
        MatDatepickerModule,
        MatNativeDateModule]
    })
    .compileComponents();
  });
  let body = [
    {
      name: "Albania"
    },
    {
      name: 'Algeria'
    }
  ];

  beforeEach(() => {
    window.fetch = jest.fn(() => new Promise<any>((resolve, reject) => resolve(
      {
        json:()=>{
           return body;
        }
      }
   )));
    fixture = TestBed.createComponent(AddEditTripComponent);
    component = fixture.componentInstance;
    tripService = TestBed.inject(TripService);
    snackbar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setup component', () => {
    describe('ngOnInit method', () => {
      it('should initialize the countries and the form groups', () => {
        let tripReasonControl = component.tripReasonGroup.controls['tripReason'];
        let tripOriginControl = component.tripOriginGroup.controls['originCountry'];
        let tripDestinationControl = component.tripDestinationGroup.controls['destinationCountry'];
        let tripDescriptionControl = component.tripDescriptionGroup.controls['tripDescription'];
        let tripDepartureDateControl = component.tripDepartureDateGroup.controls['tripDepartureDate'];
        let tripArrivalDateControl = component.tripArrivalDateGroup.controls['tripArrivalDate'];

        component.ngOnInit();

        expect(fetch).toHaveBeenCalled();
        expect(tripReasonControl.errors['required']).toBeTruthy();
        expect(tripOriginControl.errors['required']).toBeTruthy();
        expect(tripDestinationControl.errors['required']).toBeTruthy();
        expect(tripDescriptionControl.errors['required']).toBeTruthy();
        expect(tripDepartureDateControl.value).toBeTruthy();
        expect(tripArrivalDateControl.value).toBeTruthy();
      })
    });
  });

  describe('addTrip method', () => {
    const expectedTrip = {
      ...TestingElements.TRIP,
      departureDate: TestingElements.TRIP.departureDate.toISOString(),
      arrivalDate: TestingElements.TRIP.arrivalDate.toISOString()
    };
    delete expectedTrip.id;
    delete expectedTrip.status;

    it('should get trip from fields and save the trip', () => {
      let tripReasonGetSpy = jest.spyOn(component.tripReasonGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.reason));
      let tripOriginSpy = jest.spyOn(component.tripOriginGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.fromCountry));
      let tripDestinationSpy = jest.spyOn(component.tripDestinationGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.toCountry));
      let tripDescriptionSpy = jest.spyOn(component.tripDescriptionGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.description));
      let tripDepartureDateSpy = jest.spyOn(component.tripDepartureDateGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.departureDate));
      let tripArrivalDateSpy = jest.spyOn(component.tripArrivalDateGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.arrivalDate));

      let postAddTripSpy = jest.spyOn(tripService, 'postAddTrip').mockReturnValue(of(TestingElements.TRIP));
      let snackbarOpenSpy = jest.spyOn(snackbar, 'open');

      component.addTrip();

      expect(postAddTripSpy).toHaveBeenCalledWith(expectedTrip);
      component.onTripAdded.subscribe(trip => {
        expect(trip).toEqual(TestingElements.TRIP);
      });
      expect(snackbarOpenSpy).toHaveBeenCalledWith("Trip created", "Dismiss", { duration: 3000 });
    });

    it('should consoleLog error from tripService', () => {
      let tripReasonGetSpy = jest.spyOn(component.tripReasonGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.reason));
      let tripOriginSpy = jest.spyOn(component.tripOriginGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.fromCountry));
      let tripDestinationSpy = jest.spyOn(component.tripDestinationGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.toCountry));
      let tripDescriptionSpy = jest.spyOn(component.tripDescriptionGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.description));
      let tripDepartureDateSpy = jest.spyOn(component.tripDepartureDateGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.departureDate));
      let tripArrivalDateSpy = jest.spyOn(component.tripArrivalDateGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.arrivalDate));

      let error = new Error("Internal Server Error");
      let postAddTripSpy = jest.spyOn(tripService, 'postAddTrip').mockReturnValue(throwError(error));
      let consoleLogSpy = jest.spyOn(console, 'log');

      component.addTrip();

      expect(postAddTripSpy).toHaveBeenCalledWith(expectedTrip);
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('enableEditTrip method', () => {
    it('should set the necessary fields for the trip that is being edited', () => {
      component.enableEditTrip(TestingElements.TRIP);

      expect(component.isLinear).toBeFalsy();
      expect(component.tripDescriptionGroup.controls['tripDescription'].value).toEqual(TestingElements.TRIP.description);
      expect(component.tripOriginGroup.controls['originCountry'].value).toEqual(TestingElements.TRIP.fromCountry);
      expect(component.tripDestinationGroup.controls['destinationCountry'].value).toEqual(TestingElements.TRIP.toCountry);
      expect(component.tripDepartureDateGroup.controls['tripDepartureDate'].value).toEqual(TestingElements.TRIP.departureDate);
      expect(component.tripArrivalDateGroup.controls['tripArrivalDate'].value).toEqual(TestingElements.TRIP.arrivalDate);
  
      expect(component.editingTrip).toEqual(TestingElements.TRIP);
    });
  });

  describe('editTrip method', () => {
    const expectedTrip = {
      ...TestingElements.TRIP,
      departureDate: TestingElements.TRIP.departureDate.toISOString(),
      arrivalDate: TestingElements.TRIP.arrivalDate.toISOString(),
      description: 'New Description'
    };
    delete expectedTrip.status;

    const EDITED_TRIP = { ...TestingElements.TRIP, description: 'New Description'};

    it('should get trip from fields and edit the trip', () => {
      let tripReasonGetSpy = jest.spyOn(component.tripReasonGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.reason));
      let tripOriginSpy = jest.spyOn(component.tripOriginGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.fromCountry));
      let tripDestinationSpy = jest.spyOn(component.tripDestinationGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.toCountry));
      let tripDescriptionSpy = jest.spyOn(component.tripDescriptionGroup, 'get').mockReturnValue(new FormControl("New Description"));
      let tripDepartureDateSpy = jest.spyOn(component.tripDepartureDateGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.departureDate));
      let tripArrivalDateSpy = jest.spyOn(component.tripArrivalDateGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.arrivalDate));

      component.editingTrip = TestingElements.TRIP;
      fixture.detectChanges();
      
      let postEditTripSpy = jest.spyOn(tripService, 'postEditTrip').mockReturnValue(of(EDITED_TRIP));
      
      component.editTrip();

      expect(postEditTripSpy).toHaveBeenCalledWith(expectedTrip);
      component.onTripUpdated.subscribe(editedTrip => {
        expect(editedTrip).toEqual(EDITED_TRIP);
      });
      expect(component.isLinear).toBeTruthy();
    });

    it('should console log error from trip service', () => {
      let tripReasonGetSpy = jest.spyOn(component.tripReasonGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.reason));
      let tripOriginSpy = jest.spyOn(component.tripOriginGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.fromCountry));
      let tripDestinationSpy = jest.spyOn(component.tripDestinationGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.toCountry));
      let tripDescriptionSpy = jest.spyOn(component.tripDescriptionGroup, 'get').mockReturnValue(new FormControl("New Description"));
      let tripDepartureDateSpy = jest.spyOn(component.tripDepartureDateGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.departureDate));
      let tripArrivalDateSpy = jest.spyOn(component.tripArrivalDateGroup, 'get').mockReturnValue(new FormControl(TestingElements.TRIP.arrivalDate));

      component.editingTrip = TestingElements.TRIP;
      fixture.detectChanges();
      let error = new Error("Internal Server Error");
      
      let postEditTripSpy = jest.spyOn(tripService, 'postEditTrip').mockReturnValue(throwError(error));
      let consoleLogSpy = jest.spyOn(console, 'log');
      
      component.editTrip();

      expect(consoleLogSpy).toHaveBeenCalledWith(error);
    })
  });
});
