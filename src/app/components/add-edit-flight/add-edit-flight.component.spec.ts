import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFlightComponent } from './add-edit-flight.component';

describe('AddEditFlightComponent', () => {
  let component: AddEditFlightComponent;
  let fixture: ComponentFixture<AddEditFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditFlightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
