import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {HomepageComponent} from "./components/homepage/homepage.component";
import {BookingComponent} from "./components/booking/booking.component";
import {AdminDashboardComponent} from "./components/admin-dashboard/admin-dashboard.component";

export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'booking', component: BookingComponent},
  {path:'admin',component:AdminDashboardComponent}
];
