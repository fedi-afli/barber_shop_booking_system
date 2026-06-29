import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../../models/UserModel";
import {Observable} from "rxjs";
import {RegisterPayload} from "../../models/RegisterPayload";

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }


  registerUser(payload: RegisterPayload): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}/users`, payload);
  }
}
