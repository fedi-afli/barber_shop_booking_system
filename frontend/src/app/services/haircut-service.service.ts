import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {HaircutService} from "../../models/haircut-service.model";
import { environment } from "../../environments/environment";
// It's a best practice to define the shape of your data


@Injectable({
  providedIn: 'root'
})
export class HaircutServiceService {
  // Your Spring Boot API endpoint
  private apiUrl = environment.apiUrl;

  // Inject the HttpClient
  constructor(private http: HttpClient) { }

  getServices(): Observable<HaircutService[]> {
    return this.http.get<HaircutService[]>(this.apiUrl+"/haircuts/services");
  }
}
