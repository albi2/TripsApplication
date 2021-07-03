import { Component, Input, OnInit } from '@angular/core';
import { Flight } from 'src/app/models/Flight';
import { Trip } from 'src/app/models/Trip';

@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.scss']
})
export class FlightCardComponent implements OnInit {
  isActive: boolean = false;
  @Input() flight: Flight;
  @Input() trip: Trip;

  constructor() { }

  ngOnInit(): void {
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }

  calculateDuration() {
    let difference = +new Date(this.flight.arrivalDate) - +new Date(this.flight.departureDate);
    let d: Date = new Date(0,0,0);
    d.setMilliseconds(difference);
    return d.toISOString();
  }
}
