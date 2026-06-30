package com.barbershop.barber_booking_system.repositories;

import com.barbershop.barber_booking_system.entities.Barber;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BarberRepository extends JpaRepository<Barber, Long> {

    List<Barber> findByActiveTrue();
    Optional<Barber> findByUserId(long barberId);


}