import { Component, OnInit } from '@angular/core';
// Import the Service
import { HaircutServiceService } from "../../services/haircut-service.service";
// Import the Model
import { HaircutService } from "../../../models/haircut-service.model";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [], // Add CommonModule here if you use *ngIf or *ngFor in your HTML
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {

  // 1. Initialize with an empty array
  services: HaircutService[] = [];

  // 2. Inject the Service class, not the interface
  constructor(private haircutServiceService: HaircutServiceService) {
  }

  ngOnInit(): void {
    // Call the method when the component loads
    this.getServices();
  }

  getServices() {
    // 3. Subscribe to the Observable to receive the data
    this.haircutServiceService.getServices().subscribe({
      next: (data: HaircutService[]) => {
        this.services = data; // Assign the fetched data to your array
      },
      error: (error) => {
        console.error('There was an error fetching the services!', error);
      }
    });
  }

}
