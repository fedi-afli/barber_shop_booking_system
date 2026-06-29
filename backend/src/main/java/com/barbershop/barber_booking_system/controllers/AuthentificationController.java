package com.barbershop.barber_booking_system.controllers;

import com.barbershop.barber_booking_system.dto.AuthResponse;
import com.barbershop.barber_booking_system.dto.LoginRequest;
import com.barbershop.barber_booking_system.services.AuthentificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthentificationController {

    private final AuthentificationService authentificationService;

    public AuthentificationController(AuthentificationService authentificationService) {
        this.authentificationService = authentificationService; // ✅ was missing
    }

    @PostMapping("/login")  // ✅ just /login, not the full path again
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authentificationService.login(request)); // ✅ wrapped in ResponseEntity.ok()
    }
}