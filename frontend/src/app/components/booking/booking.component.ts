import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppointmentsService, CreateBookingRequest, BookedSlot } from "../../services/appointments.service";
import { Router } from "@angular/router";
import { HaircutService } from "../../services/haircut.service";
import { HaircutModel } from "../../../models/haircut.model";
import { NgClass } from '@angular/common';
import { BarberModel } from "../../../models/BarberModel";
import { BarberService } from "../../services/barber.service";
import { AuthentificationService } from "../../services/authentification.service";
import { UserModel} from "../../../models/UserModel";

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {

  servicesList: HaircutModel[] = [];
  activeBarbers: BarberModel[] = [];
  bookingForm!: FormGroup;

  currentUser: UserModel | null = null;
  isLoggedIn = false;

  timeSlots: string[] = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];
  blockedTimes: Set<string> = new Set();
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  todayDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private bookingService: AppointmentsService,
    private haircutService: HaircutService,
    private router: Router,
    private barberService: BarberService,
    private authService: AuthentificationService,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();

    this.initForm();
    this.getServices();
    this.getActiveBarbers();
    this.initListeners();
  }

  initForm() {
    // ✅ Logged-in users skip identity fields, guests must fill them
    this.bookingForm = this.fb.group({
      fullName: [
        this.isLoggedIn ? this.currentUser?.username : '',
        this.isLoggedIn ? [] : [Validators.required]
      ],
      phoneNumber: [
        '',
        this.isLoggedIn ? [] : [Validators.required, Validators.pattern('^[0-9+ ]{8,15}$')]
      ],
      email: [this.isLoggedIn ? this.currentUser?.email : ''],
      serviceSelection: ['', Validators.required],
      barber: ['', Validators.required],
      date: [''],
      time: ['', Validators.required]
    });
  }

  getActiveBarbers() {
    this.barberService.getActiveBarbers().subscribe({
      next: (data) => this.activeBarbers = data,
      error: (err) => {
        console.error('Error loading barbers:', err);
        this.errorMessage = 'Failed to load barbers. Please try again.';
      }
    });
  }

  initListeners() {
    this.bookingForm.get('date')?.valueChanges.subscribe(() => {
      this.checkAvailability();
    });

    this.bookingForm.get('barber')?.valueChanges.subscribe(() => {
      this.checkAvailability();
    });

    this.bookingForm.get('serviceSelection')?.valueChanges.subscribe(() => {
      this.checkAvailability();
    });
  }

  getServices() {
    this.haircutService.getServices().subscribe({
      next: (data) => this.servicesList = data,
      error: (err) => {
        console.error('Error loading services:', err);
        this.errorMessage = 'Failed to load services. Please try again.';
      }
    });
  }


  checkAvailability() {
    const date = this.bookingForm.get('date')?.value;
    const barberId = Number(this.bookingForm.get('barber')?.value);
    const haircutTypeId=Number(this.bookingForm.get('serviceSelection')?.value);

    if (!date || !barberId || !haircutTypeId) {
      this.blockedTimes.clear();
      return;
    }

    this.blockedTimes.clear();

    this.bookingService.getBlockedSlots(date, barberId)
      .subscribe({
        next: (res) => {
          const bookedSlots = res.bookedSlots || [];
          this.blockedTimes = this.calculateBlockedSlots(bookedSlots);
        },
        error: (err) => {
          console.error('Error fetching blocked slots:', err);
          this.blockedTimes.clear();
        }
      });
  }

  private calculateBlockedSlots(bookedSlots: BookedSlot[]): Set<string> {
    const blocked = new Set<string>();

    for (const slot of bookedSlots) {
      const startIndex = this.timeSlots.indexOf(slot.startTime);
      if (startIndex === -1) continue;

      const slotsToBlock = Math.ceil(slot.duration / 30);

      for (let i = 0; i < slotsToBlock; i++) {
        if (startIndex + i < this.timeSlots.length) {
          blocked.add(this.timeSlots[startIndex + i]);
        }
      }
    }

    return blocked;
  }

  isSlotBlocked(time: string): boolean {
    return this.blockedTimes.has(time);
  }

  onSubmit() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.bookingForm.value;

    const request: CreateBookingRequest = {
      // ✅ use stored user info if logged in, otherwise form input
      clientName:  this.isLoggedIn ? (this.currentUser?.username ?? '') : formValue.fullName,
      clientPhone: this.isLoggedIn ? (formValue.phoneNumber || '') : formValue.phoneNumber,
      clientEmail: this.isLoggedIn ? this.currentUser?.email : (formValue.email || undefined),
      barberId: Number(formValue.barber),
      haircutTypeId: Number(formValue.serviceSelection),
      date: formValue.date,
      startTime: formValue.time
    };

    this.bookingService.createBooking(request)
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage = `Appointment booked successfully! Your booking ID is ${response.id}.`;
          this.bookingForm.reset();
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Booking failed:', err);
          this.errorMessage = err.error?.message || 'Failed to create appointment. The selected time slot may no longer be available.';
        }
      });
  }
  openDatePicker(input: HTMLInputElement) {
    // showPicker() is supported in modern Chrome, Edge, and recent Firefox/Safari
    if (typeof (input as any).showPicker === 'function') {
      (input as any).showPicker();
    } else {
      input.focus();
      input.click();
    }
  }

  getServiceIcon(serviceName: string): 'scissors' | 'razor' | 'comb' {
    const name = serviceName.toLowerCase();
    if (name.includes('beard') || name.includes('barbe')) return 'razor';
    if (name.includes('style') || name.includes('soin')) return 'comb';
    return 'scissors';
  }
}
