package com.barbershop.barber_booking_system.services;

import com.barbershop.barber_booking_system.dto.CreateUserDTO;
import com.barbershop.barber_booking_system.dto.UserDTO;
import com.barbershop.barber_booking_system.entities.Role;
import com.barbershop.barber_booking_system.entities.User;
import com.barbershop.barber_booking_system.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public UserDTO getById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return toDTO(user);
    }

    public UserDTO create(CreateUserDTO dto) {
        if (repository.existsByUsername(dto.username())) {
            throw new IllegalStateException("Username already exists: " + dto.username());
        }

        User user = User.builder()
                .username(dto.username())
                .password(passwordEncoder.encode(dto.password()))
                .role(Role.valueOf(dto.role().toUpperCase()))
                .build();

        User saved = repository.save(user);
        return toDTO(saved);
    }

    public UserDTO update(Long id, CreateUserDTO dto) {
        User existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        if (!existing.getUsername().equals(dto.username()) &&
            repository.existsByUsername(dto.username())) {
            throw new IllegalStateException("Username already exists: " + dto.username());
        }

        existing.setUsername(dto.username());
        existing.setPassword(dto.password());
        existing.setRole(Role.valueOf(dto.role().toUpperCase()));

        User saved = repository.save(existing);
        return toDTO(saved);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private UserDTO toDTO(User u) {
        return new UserDTO(u.getId(), u.getUsername(),u.getEmail(), u.getRole().name(),u.getPassword());
    }
}
