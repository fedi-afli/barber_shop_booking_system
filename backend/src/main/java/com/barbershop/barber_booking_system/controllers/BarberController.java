package com.barbershop.barber_booking_system.controllers;

import com.barbershop.barber_booking_system.dto.AppointmentDTO;
import com.barbershop.barber_booking_system.entities.Barber;
import com.barbershop.barber_booking_system.services.AppointmentService;
import com.barbershop.barber_booking_system.services.BarberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/barbers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BarberController {

    private final BarberService barberService;
    private final AppointmentService appointmentService;

    // GET /api/barbers
    @GetMapping
    public ResponseEntity<List<Barber>> getAllBarbers() {
        return ResponseEntity.ok(barberService.getAllBarbers());
    }

    // GET /api/barbers/active
    @GetMapping("/active")
    public ResponseEntity<List<Barber>> getActiveBarbers() {
        return ResponseEntity.ok(barberService.getActiveBarbers());
    }

    // GET /api/barbers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Barber> getBarberById(@PathVariable Long id) {
        return ResponseEntity.ok(barberService.getBarberById(id));
    }

    // POST /api/barbers
    @PostMapping
    public ResponseEntity<Barber> createBarber(@RequestBody Barber barber) {
        Barber createdBarber = barberService.createBarber(barber);
        return new ResponseEntity<>(createdBarber, HttpStatus.CREATED);
    }

    // PUT /api/barbers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Barber> updateBarber(
            @PathVariable Long id,
            @RequestBody Barber barber) {

        return ResponseEntity.ok(barberService.updateBarber(id, barber));
    }

    // DELETE /api/barbers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBarber(@PathVariable Long id) {
        barberService.deleteBarber(id);
        return ResponseEntity.noContent().build();
    }

    // PATCH /api/barbers/{id}/activate
    @PatchMapping("/{id}/activate")
    public ResponseEntity<Barber> activateBarber(@PathVariable Long id) {
        return ResponseEntity.ok(barberService.activateBarber(id));
    }

    // PATCH /api/barbers/{id}/deactivate
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Barber> deactivateBarber(@PathVariable Long id) {
        return ResponseEntity.ok(barberService.deactivateBarber(id));
    }
    @GetMapping("/{id}/name")
    public ResponseEntity<String> getBarberNameById(@PathVariable Long id) {
        return ResponseEntity.ok(barberService.getBarberName(id));
    }
    @GetMapping("/{id}/appointments")
    public ResponseEntity<List<AppointmentDTO>> getBarberAppointments(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getBarberAppointments(id));
    }
}
 