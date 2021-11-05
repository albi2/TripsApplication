import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminService } from 'src/app/services/admin.service';
import { ToggleComponent } from './toggle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestingElements } from 'src/test/mocks/TestingElements';
import { MockAdminService } from 'src/test/mocks/MockAdminService';
import { throwError } from 'rxjs';

describe('ToggleComponent', () => {
  let component: ToggleComponent;
  let fixture: ComponentFixture<ToggleComponent>
  let adminServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ ToggleComponent ],
      providers: [
        {provide: AdminService, useClass: MockAdminService}
      ]
    })
    .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleComponent);
    // Gain access to created component
    component = fixture.componentInstance;
    // Gain access to service that is
    adminServiceMock = TestBed.inject(AdminService);
    component.trip = TestingElements.TRIP;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });

  describe('setup the component', () => {
      describe('ngOnInit', () => {
          it('should set isApproved to true', () => {
            component.trip.status = "APPROVED";
            fixture.detectChanges();
            component.ngOnInit();

            expect(component.approved.value).toBe(true);
          })
      })
  })

  describe('test change of status', () => {
    describe('changeStatus', () => {
      it('should change status to WAITING_FOR_APPROVAL', () => {
        component.trip.status = "CREATED";
        component.approved.setValue(false);
        fixture.detectChanges();

        const tripStatusUpdatedMock = jest.spyOn(component.tripStatusUpdated, 'emit');
        const updateTripStatusSpy = jest.spyOn(adminServiceMock, "updateTripStatus");
        
        component.changeStatus();
        
        expect(updateTripStatusSpy).toHaveBeenCalledWith(TestingElements.TRIP.id, TestingElements.STATUS_WAITING_FOR_APPROVAL);
        expect(tripStatusUpdatedMock).toHaveBeenCalled();
        component.tripStatusUpdated.subscribe(trip => {
          expect(trip).toEqual({...TestingElements.TRIP, status: "WAITING_FOR_APPROVAL"});
       });
      });
      
      it('should change status to APPROVED', () => {
        component.approved.setValue(true);
        fixture.detectChanges();

        const tripStatusUpdatedMock = jest.spyOn(component.tripStatusUpdated, 'emit');
        const updateTripStatusSpy = jest.spyOn(adminServiceMock, "updateTripStatus");

        component.changeStatus();

        expect(updateTripStatusSpy).toHaveBeenCalledWith(TestingElements.TRIP.id, TestingElements.STATUS_APRROVED);
        expect(tripStatusUpdatedMock).toHaveBeenCalled();
        component.tripStatusUpdated.subscribe(trip => {
          expect(trip).toEqual({...TestingElements.TRIP, status: "APPROVED"});
        });
      });

      it('should change status to APPROVED', () => {
        component.trip.id = 2;
        fixture.detectChanges();

        const updateTripStatusSpy = jest.spyOn(adminServiceMock, "updateTripStatus").mockReturnValue(throwError(new Error(TestingElements.ERROR_MESSAGE_TRIP)));

        const consoleLogSpy = jest.spyOn(console, 'log');

        component.changeStatus();

        expect(consoleLogSpy).toHaveBeenCalledWith(TestingElements.ERROR_MESSAGE_TRIP);
      });
    })
  })
});
