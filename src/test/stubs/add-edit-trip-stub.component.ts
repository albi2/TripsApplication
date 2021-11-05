import { Component } from "@angular/core";
import { AddEditTripComponent } from "src/app/components/add-edit-trip/add-edit-trip.component";
import { Trip } from "src/app/models/Trip";

@Component({
    selector: 'app-add-edit-trip',
    template: '',
  providers: [
    {
        provide: AddEditTripComponent,
        useClass: AddEditTripStubComponent
      }
  ]
  })
export class AddEditTripStubComponent {
    public enableEditTrip(trip: Trip) : void {
        console.log("Enabling edit trip!");
    }
}