import { Component, OnInit } from '@angular/core';
// Import the Service
import { HaircutService } from "../../services/haircut.service";
// Import the Model
import { HaircutModel } from "../../../models/haircut.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [], // Add CommonModule here if you use *ngIf or *ngFor in your HTML
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {

  // 1. Initialize with an empty array
  servicesList: HaircutModel[] = [];

  // 2. Inject the Service class, not the interface
  constructor(private haircutService: HaircutService,private router: Router,) {
  }

  ngOnInit(): void {
    // Call the method when the component loads
    this.getServices();
  }

  getServices() {
    // 3. Subscribe to the Observable to receive the data
    this.haircutService.getServices().subscribe({
      next: (data: HaircutModel[]) => {
        this.servicesList = data; // Assign the fetched data to your array
      },
      error: (error) => {
        console.error('There was an error fetching the services!', error);
      }
    });
  }
  NavigateToBooking(){
        this.router.navigate(['/booking']);
  }

  NavigateToLogin(){
    this.router.navigate(['/login']);
  }

}
