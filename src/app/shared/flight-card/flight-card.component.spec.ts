import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingElements } from 'src/test/mocks/TestingElements';

import { FlightCardComponent } from './flight-card.component';

describe('FlightCardComponent', () => {
  let component: FlightCardComponent;
  let fixture: ComponentFixture<FlightCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightCardComponent);
    component = fixture.componentInstance;
    component.trip = TestingElements.TRIP;
    component.flight = TestingElements.FLIGHT;
    fixture.detectChanges();
  });

  describe("toggle whether the flight card is opened or closed", () => {
    describe("toggleActive", () => {
      it("should change isActive to true", () => {
        component.toggleActive();

        expect(component.isActive).toEqual(true);
      })
    })
  })

  describe("calculate the duration between two dates", () => {
    describe("calculateDuration", () => {
      it("should return the difference duration as an ISO format date", () => {
        let date: Date = new Date(component.calculateDuration());
        expect(date.getHours()).toEqual(1);
      })
    })
  })
});
