package com.barbershop.barber_booking_system.services;


import com.barbershop.barber_booking_system.dto.AuthResponse;
import com.barbershop.barber_booking_system.dto.LoginRequest;
import com.barbershop.barber_booking_system.dto.UserDTO;
import com.barbershop.barber_booking_system.entities.Barber;
import com.barbershop.barber_booking_system.entities.Role;
import com.barbershop.barber_booking_system.repositories.BarberRepository;
import com.barbershop.barber_booking_system.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthentificationService {

    private final UserRepository repository;
    private final BarberRepository barberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthentificationService(UserRepository repository, BarberRepository barberRepository,
                                   PasswordEncoder passwordEncoder,
                                   JwtService jwtService) {
        this.repository      = repository;
        this.barberRepository = barberRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService      = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        var user = repository.findByUsername(request.username())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"
                ));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Wrong password"
            );
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());

        Long barberId = null;
        if (user.getRole() == Role.BARBER) {
            System.out.println("User is a barber. User ID: " + user.getId());
            barberId = barberRepository.findByUserId(user.getId())
                    .map(Barber::getId)
                    .orElse(null);
        }

        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                null,
                barberId
        );
        System.out.println("User " + userDTO);
        return new AuthResponse(token, userDTO);
    }
}