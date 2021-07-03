import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { GeneralUserGuard } from './guards/GeneralUserGuard';
import { AdminGuard } from './guards/AdminGuard';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { MyTripsComponent } from './components/my-trips/my-trips.component';
import { UsersComponent } from './components/users/users.component';
import { AdminUserDetailsComponent } from './components/admin-user-details/admin-user-details.component';
import { TripFlightsComponent } from './components/trip-flights/trip-flights.component';
const routes: Routes = [
  {path: 'home', component: HomepageComponent, canActivate: [GeneralUserGuard]},
  {path: 'myProfile', component: MyProfileComponent, children: [
    {path: 'my-trips', component: MyTripsComponent},
    {path: 'trip/:tripId/flights', component: TripFlightsComponent}
  ]},
  {path: 'admin', component: MyProfileComponent, children: [
    {path: 'users', component: UsersComponent},
    {path: 'user-details/:id', component: AdminUserDetailsComponent}
  ], canActivate: [AdminGuard]},
  { path: '',   redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
