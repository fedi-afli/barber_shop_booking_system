import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentModel } from '../../../models/AppointmentModel';
import { AppointmentsService } from '../../services/appointments.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  appointments: AppointmentModel[] = [];
  filterStatus: string = 'ALL';
  today: string = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  constructor(private appointmentsService: AppointmentsService) {}

  ngOnInit(): void {
    this.getAllAppointments();
  }

  getAllAppointments(): void {
    this.appointmentsService.getAllAppointments().subscribe(appointments => {
      this.appointments = appointments;
    });
  }

  // ── KPI helpers ──────────────────────────────────────────

  getPending(): number {
    return this.appointments.filter(a => a.status === 'PENDING').length;
  }

  getConfirmed(): number {
    return this.appointments.filter(a => a.status === 'CONFIRMED').length;
  }

  getCancelled(): number {
    return this.appointments.filter(a => a.status === 'CANCELLED').length;
  }

  // ── Table filter ─────────────────────────────────────────

  getFiltered(): AppointmentModel[] {
    if (this.filterStatus === 'ALL') return this.appointments;
    return this.appointments.filter(a => a.status === this.filterStatus);
  }

  // ── Donut chart arc (stroke-dasharray value) ─────────────
  // circumference = 2π × 48 ≈ 301.6

  getArc(status: string): number {
    if (this.appointments.length === 0) return 0;
    const count = this.appointments.filter(a => a.status === status).length;
    return (count / this.appointments.length) * 301.6;
  }

  // ── Top barbers ───────────────────────────────────────────

  getTopBarbers(): { name: string; count: number }[] {
    const map = new Map<string, number>();
    this.appointments.forEach(a => {
      const name = a.barber?.name ?? 'Unknown';
      map.set(name, (map.get(name) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  // ── Top services ──────────────────────────────────────────

  getTopServices(): { name: string; count: number }[] {
    const map = new Map<string, number>();
    this.appointments.forEach(a => {
      const name = a.haircutType?.name ?? 'Unknown';
      map.set(name, (map.get(name) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}
