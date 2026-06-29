    package com.barbershop.barber_booking_system.dto;

    public record UserDTO(
            Long id,
            String username,
            String email,
            String role,
            String password
    ) {}