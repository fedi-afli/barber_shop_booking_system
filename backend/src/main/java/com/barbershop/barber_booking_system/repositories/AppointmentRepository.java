package com.barbershop.barber_booking_system.repositories;

import com.barbershop.barber_booking_system.entities.Appointment;
import com.barbershop.barber_booking_system.entities.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a " +
           "WHERE a.barber.id = :barberId AND a.date = :date " +
           "AND a.status NOT IN ('CANCELLED') " +
           "AND a.startTime < :endTime AND a.endTime > :startTime")
    boolean hasConflict(@Param("barberId") Long barberId,
                       @Param("date") LocalDate date,
                       @Param("startTime") LocalTime startTime,
                       @Param("endTime") LocalTime endTime);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a " +
           "WHERE a.barber.id = :barberId AND a.date = :date " +
           "AND a.status NOT IN ('CANCELLED') " +
           "AND a.startTime < :endTime AND a.endTime > :startTime " +
           "AND a.id <> :excludeId")
    boolean hasConflictExcludingId(@Param("barberId") Long barberId,
                                  @Param("date") LocalDate date,
                                  @Param("startTime") LocalTime startTime,
                                  @Param("endTime") LocalTime endTime,
                                  @Param("excludeId") Long excludeId);



    @Query("SELECT a FROM Appointment a JOIN FETCH a.barber JOIN FETCH a.haircutType WHERE a.id = :id")
    Optional<Appointment> findByIdWithBarberAndHaircutType(@Param("id") Long id);



    @Query("""
    SELECT a FROM Appointment a
    JOIN FETCH a.barber
    WHERE a.date = :date
    AND a.barber.id = :barberId
""")
    List<Appointment> findByDateAndBarber(
            @Param("date") LocalDate date,
            @Param("barberId") Long barberId
    );


    @Query("""
    SELECT a FROM Appointment a
    JOIN FETCH a.barber
    JOIN FETCH a.haircutType
    WHERE a.barber.id = :barberId
    ORDER BY a.date DESC, a.startTime DESC
""")
    List<Appointment> findByBarberId(@Param("barberId") Long barberId);





}
