// src/app/models/appointment.model.ts

import { BarberModel } from "./BarberModel";
import { HaircutModel } from "./haircut.model";

export interface AppointmentModel {
  id?: number;

  clientName: string;
  clientPhone: string;
  clientEmail?: string;

  barberId: number;
  barberName: string;
  haircutTypeId: number;
  haircutTypeName: string;

  date: string;       // LocalDate -> "2026-06-14"
  startTime: string;  // LocalTime -> "09:00:00"
  endTime?: string;   // Calculated by backend

  status?: string;    // Or AppointmentStatus if you create an enum
}
