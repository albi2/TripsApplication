import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripFlightsComponent } from './trip-flights.component';

describe('TripFlightsComponent', () => {
  let component: TripFlightsComponent;
  let fixture: ComponentFixture<TripFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripFlightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
