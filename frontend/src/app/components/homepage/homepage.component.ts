import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HaircutService } from "../../services/haircut.service";
import { HaircutModel } from "../../../models/haircut.model";
import { Router } from "@angular/router";
import { AuthentificationService } from "../../services/authentification.service";
import { UserModel} from "../../../models/UserModel";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {

  servicesList: HaircutModel[] = [];
  isLoggedIn = false;
  currentUser: UserModel | null = null;

  constructor(
    private haircutService: HaircutService,
    private router: Router,
    private authService: AuthentificationService,
  ) {}

  ngOnInit(): void {
    this.getServices();
    this.isLoggedIn  = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
  }

  getServices() {
    this.haircutService.getServices().subscribe({
      next: (data: HaircutModel[]) => {
        this.servicesList = data;
      },
      error: (error) => {
        console.error('There was an error fetching the services!', error);
      }
    });
  }

  NavigateToBooking() {
    this.router.navigate(['/booking']);
  }

  NavigateToLogin() {
    this.router.navigate(['/login']);
  }
}
