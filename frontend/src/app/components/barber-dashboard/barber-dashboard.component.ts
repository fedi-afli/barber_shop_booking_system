import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { AppointmentModel } from "../../../models/AppointmentModel";
import { AppointmentsService } from "../../services/appointments.service";
import { AuthentificationService } from "../../services/authentification.service";

interface AppointmentGroup {
  date: string;
  appointments: AppointmentModel[];
}

@Component({
  selector: 'app-barber-dashboard',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass],
  templateUrl: './barber-dashboard.component.html',
  styleUrl: './barber-dashboard.component.css'
})
export class BarberDashboardComponent implements OnInit {

  appointments: AppointmentModel[] = [];   // ✅ array
  groupedAppointments: AppointmentGroup[] = [];
  filterStatus: 'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' = 'ALL';

  showConfirmModal = false;
  selectedAppointment: AppointmentModel | null = null;

  barberId!: number;
  today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  constructor(
    private appointmentsService: AppointmentsService,
    private authService: AuthentificationService,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.barberId) return;   // ✅ barberId, not id

    this.barberId = user.barberId;
    this.loadAppointments();
  }

  loadAppointments(): void {

    this.appointmentsService.getBarberAppointments(this.barberId).subscribe({
      next: (data) => {
        this.appointments = data;
        this.groupByDate();
      },
      error: (err) => console.error('Error loading appointments:', err)
    });
  }

  groupByDate(): void {
    const filtered = this.getFiltered();
    const map = new Map<string, AppointmentModel[]>();

    for (const appt of filtered) {
      if (!map.has(appt.date)) {
        map.set(appt.date, []);
      }
      map.get(appt.date)!.push(appt);
    }

    this.groupedAppointments = Array.from(map.entries())
      .map(([date, appointments]) => ({
        date,
        appointments: appointments.sort((a, b) => a.startTime.localeCompare(b.startTime))
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  getFiltered(): AppointmentModel[] {
    if (this.filterStatus === 'ALL') return this.appointments;
    return this.appointments.filter(a => a.status === this.filterStatus);
  }

  setFilter(status: 'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'): void {
    this.filterStatus = status;
    this.groupByDate();
  }

  getPending(): number {
    return this.appointments.filter(a => a.status === 'PENDING').length;
  }

  getConfirmed(): number {
    return this.appointments.filter(a => a.status === 'CONFIRMED').length;
  }

  getCancelled(): number {
    return this.appointments.filter(a => a.status === 'CANCELLED').length;
  }

  selectAppointment(appt: AppointmentModel): void {
    this.selectedAppointment = appt;
    this.showConfirmModal = true;
  }

  confirmAppointment(): void {
    if (!this.selectedAppointment) return;

    this.appointmentsService.confirmAppointment(this.selectedAppointment.id).subscribe({
      next: () => {
        this.showConfirmModal = false;
        this.selectedAppointment = null;
        this.loadAppointments();
      },
      error: (err) => console.error('Error confirming appointment:', err)
    });
  }

  formatDateHeader(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
}
