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
export class AppComponent {

  isLoggedIn = false;
  currentUser: UserModel | null = null;

  constructor(
    private authService: AuthentificationService,
    private router: Router
  ) {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  bookNow(): void {
    this.router.navigate(['/booking']);
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
