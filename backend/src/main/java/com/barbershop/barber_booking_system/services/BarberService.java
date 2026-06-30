package com.barbershop.barber_booking_system.services;


import com.barbershop.barber_booking_system.entities.Barber;
import com.barbershop.barber_booking_system.repositories.BarberRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BarberService {

    private final BarberRepository repository;

    public BarberService(BarberRepository repository) {
        this.repository = repository;
    }

    public List<Barber> getAllBarbers() {
        return repository.findAll();
    }

    public List<Barber> getActiveBarbers() {
        return repository.findByActiveTrue();
    }

    public Barber getBarberById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Barber not found with id: " + id));
    }

    public Barber createBarber(Barber barber) {
        barber.setActive(true);
        return repository.save(barber);
    }

    public Barber updateBarber(Long id, Barber barber) {
        Barber existing = getBarberById(id);
        existing.setName(barber.getName());
        existing.setPhone(barber.getPhone());
        if (barber.getActive() != null) {
            existing.setActive(barber.getActive());
        }
        return repository.save(existing);
    }

    public void deleteBarber(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Barber not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public Barber activateBarber(Long id) {
        Barber barber = getBarberById(id);
        barber.setActive(true);
        return repository.save(barber);
    }

    public Barber deactivateBarber(Long id) {
        Barber barber = getBarberById(id);
        barber.setActive(false);
        return repository.save(barber);
    }

    public String getBarberName(Long barberId) {
        Optional<Barber> barber = this.repository.findById(barberId);
        return barber.map(Barber::getName).orElse(null);
    }



}
