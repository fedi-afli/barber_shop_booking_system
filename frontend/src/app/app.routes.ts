import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {HomepageComponent} from "./components/homepage/homepage.component";
import {BookingComponent} from "./components/booking/booking.component";
import {AdminDashboardComponent} from "./components/admin-dashboard/admin-dashboard.component";
import {LoginComponent} from "./components/authentification/login/login.component";
import {SignupComponent} from "./components/authentification/signup/signup.component";
import {BarberDashboardComponent} from "./components/barber-dashboard/barber-dashboard.component";

export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'booking', component: BookingComponent},
  {path:'admin',component:AdminDashboardComponent},
  {path:'login', component:LoginComponent},
  {path:'signup', component:SignupComponent},
  {path:'barber', component:BarberDashboardComponent},
];
