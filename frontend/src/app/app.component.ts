import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthentificationService} from "./services/authentification.service";
import {UserModel} from "../models/UserModel";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  currentUser: UserModel | null = null;
  menuOpen = false;

  constructor(
    private authService: AuthentificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn  = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
  }

  bookNow(): void {
    this.router.navigate(['/booking']);
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn  = false;
    this.currentUser = null;
    this.router.navigate(['/']);
  }
}
