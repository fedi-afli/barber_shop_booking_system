import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {BarberModel} from "../../models/BarberModel";

@Injectable({
  providedIn: 'root'
})
export class BarberService {

  // Your Spring Boot API endpoint
  private apiUrl = environment.apiUrl;

  // Inject the HttpClient
  constructor(private http: HttpClient) { }

  getActiveBarbers(): Observable<BarberModel[]> {
    return this.http.get<BarberModel[]>(this.apiUrl+"/barbers/active");
  }
  getBarberName(barberId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/barbers/${barberId}/name`);
  }
}
