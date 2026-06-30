import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../../models/UserModel";
import {Observable, tap} from "rxjs";
import {RegisterPayload} from "../../models/RegisterPayload";
import {LoginRequest} from "../../models/LoginPayload";
import {AuthResponse} from "../../models/AuthResponse";
import {AppointmentModel} from "../../models/AppointmentModel";

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private apiUrl = environment.apiUrl;
  private tokenKey = '';
  private userKey  = '';
  constructor(private http: HttpClient) { }


  registerUser(payload: RegisterPayload): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}/users`, payload);
  }


  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, payload).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  getCurrentUser(): UserModel | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }


}
