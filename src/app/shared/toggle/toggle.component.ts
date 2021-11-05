import { Component, OnInit, Input, Output } from '@angular/core';
import { Form, FormControl } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { Trip } from 'src/app/models/Trip';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit {
  approved: FormControl = new FormControl(false);
  readonly STATUS_APRROVED: string = "APPROVED";
  readonly STATUS_WAITING_FOR_APPROVAL = "WAITING_FOR_APPROVAL";

  @Input() public trip: Trip;
  @Output() tripStatusUpdated = new EventEmitter<Trip>();

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    let isApproved = this.trip.status === "APPROVED";
    this.approved.setValue(isApproved);
  }

  changeStatus() {
    let approved = this.approved.value;
    let newStatus = this.STATUS_APRROVED;
    if(!approved) {
      newStatus = this.STATUS_WAITING_FOR_APPROVAL;
    } 
    
    this.adminService.updateTripStatus(this.trip.id, newStatus)
    .subscribe((res: Trip) => {
      this.tripStatusUpdated.emit(res);
    },
    err => {
      console.log(err.message);
    });
  }
}
