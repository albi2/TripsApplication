import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { PanelsComponent } from './components/panels/panels.component';
import { SignInUpComponent } from './components/sign-in-up/sign-in-up.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { WebRequestInterceptor } from './interceptors/web-request.interceptor';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToggleComponent } from './shared/toggle/toggle.component';
import { TripCardComponent } from './shared/trip-card/trip-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { MyTripsComponent } from './components/my-trips/my-trips.component';
import { AddEditTripComponent } from './components/add-edit-trip/add-edit-trip.component';
import {MatRippleModule} from '@angular/material/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {MatChipsModule} from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { UsersComponent } from './components/users/users.component';
import { AdminUserDetailsComponent } from './components/admin-user-details/admin-user-details.component';
import { SearchbarComponent } from './shared/searchbar/searchbar.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SignupDialogComponent } from './components/signup-dialog/signup-dialog.component';
import { MatDividerModule} from '@angular/material/divider';
import {MatPaginatorModule} from '@angular/material/paginator';
import { TripFlightsComponent } from './components/trip-flights/trip-flights.component';
import { AddEditFlightComponent } from './components/add-edit-flight/add-edit-flight.component';
import { FlightCardComponent } from './shared/flight-card/flight-card.component';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatNativeDateAdapter } from '@angular-material-components/datetime-picker';
import { MAT_DATE_LOCALE} from '@angular/material/core';
import { NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { WaitingApprovalComponent } from './shared/waiting-approval/waiting-approval.component';
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    PanelsComponent,
    SignInUpComponent,
    MyProfileComponent,
    SidebarComponent,
    ToggleComponent,
    TripCardComponent,
    MyTripsComponent,
    AddEditTripComponent,
    UsersComponent,
    AdminUserDetailsComponent,
    SearchbarComponent,
    SignupDialogComponent,
    TripFlightsComponent,
    AddEditFlightComponent,
    FlightCardComponent,
    WaitingApprovalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatChipsModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatDialogModule,
    MatDividerModule,
    MatPaginatorModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule

  ],
  providers: [ 
    MatDatepickerModule,
    MatNativeDateModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WebRequestInterceptor,
      multi: true
    },
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {floatLabel: 'auto'}},
    NgxMatNativeDateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
