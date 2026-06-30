import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppointmentModel } from "../../models/AppointmentModel";

export interface CreateBookingRequest {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  barberId: number;
  haircutTypeId: number;
  date: string;
  startTime: string;
}

export interface BookingResponse {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  barberId: number;
  haircutTypeId: number;
  date: string;
  startTime: string;
  status: string;
}

export interface BookedSlot {
  startTime: string;
  duration: number;
}

export interface BlockedSlotsResponse {
  bookedSlots: BookedSlot[];
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private apiUrl = `${environment.apiUrl}/appointments`;
  private baseUrl = environment.apiUrl;   // ✅ for non-/appointments endpoints

  constructor(private http: HttpClient) {}

  createBooking(bookingData: CreateBookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.apiUrl, bookingData);
  }

  getBlockedSlots(date: string, barberId: number): Observable<BlockedSlotsResponse> {
    return this.http.get<BlockedSlotsResponse>(
      `${this.apiUrl}/blocked-slots`,
      { params: { date, barberId } }
    );
  }

  getAllAppointments(): Observable<AppointmentModel[]> {
    return this.http.get<AppointmentModel[]>(`${this.apiUrl}`);
  }

  confirmAppointment(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/confirm`, {});
  }

  getBarberAppointments(barberId: number): Observable<AppointmentModel[]> {

    return this.http.get<AppointmentModel[]>(`${this.baseUrl}/barbers/${barberId}/appointments`);
  }
}
