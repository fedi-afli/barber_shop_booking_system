package com.barbershop.barber_booking_system.services;


import com.barbershop.barber_booking_system.dto.AuthResponse;
import com.barbershop.barber_booking_system.dto.LoginRequest;
import com.barbershop.barber_booking_system.dto.UserDTO;
import com.barbershop.barber_booking_system.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthentificationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthentificationService(UserRepository repository,
                                   PasswordEncoder passwordEncoder,
                                   JwtService jwtService) {
        this.repository      = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService      = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Find user by username
        var user = repository.findByUsername(request.username())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"
                ));

        // 2. Check password
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Wrong password"
            );
        }

        // 3. Generate token
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());

        // 4. Build and return response
        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                null   // never send password back
        );

        return new AuthResponse(token, userDTO);
    }
}