package com.barbershop.barber_booking_system.dto;

public record AuthResponse(String token, UserDTO user) {}