package com.barbershop.barber_booking_system.services;

import com.barbershop.barber_booking_system.dto.AppointmentDTO;
import com.barbershop.barber_booking_system.dto.CreateAppointmentDTO;
import com.barbershop.barber_booking_system.entities.Appointment;
import com.barbershop.barber_booking_system.entities.AppointmentStatus;
import com.barbershop.barber_booking_system.entities.Barber;
import com.barbershop.barber_booking_system.entities.HaircutType;
import com.barbershop.barber_booking_system.repositories.AppointmentRepository;
import com.barbershop.barber_booking_system.repositories.BarberRepository;
import com.barbershop.barber_booking_system.repositories.HaircutTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {

    private static final LocalTime BUSINESS_OPEN = LocalTime.of(9, 0);
    private static final LocalTime BUSINESS_CLOSE = LocalTime.of(18, 0);

    private final AppointmentRepository repository;
    private final BarberRepository barberRepository;
    private final HaircutTypeRepository haircutTypeRepository;

    public AppointmentService(AppointmentRepository repository, BarberRepository barberRepository, HaircutTypeRepository haircutTypeRepository) {
        this.repository = repository;
        this.barberRepository = barberRepository;
        this.haircutTypeRepository = haircutTypeRepository;
    }

    @Transactional(readOnly = true)
    public List<AppointmentDTO> getAll() {
        return repository.findAllWithBarberAndHaircutType()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public AppointmentDTO getById(Long id) {
        Appointment appointment = repository.findByIdWithBarberAndHaircutType(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + id));
        return toDTO(appointment);
    }

    @Transactional
    public AppointmentDTO create(CreateAppointmentDTO dto) {
        Barber barber = barberRepository.findById(dto.barberId())
                .orElseThrow(() -> new EntityNotFoundException("Barber not found with id: " + dto.barberId()));

        if (!barber.getActive()) {
            throw new IllegalStateException("Barber is not active");
        }

        HaircutType haircutType = haircutTypeRepository.findById(dto.haircutTypeId())
                .orElseThrow(() -> new EntityNotFoundException("Haircut type not found with id: " + dto.haircutTypeId()));

        if (haircutType.getDuration() == null || haircutType.getDuration() <= 0) {
            throw new IllegalArgumentException("Haircut duration must be positive");
        }

        LocalDate date = LocalDate.parse(dto.date());
        LocalTime startTime = LocalTime.parse(dto.startTime());
        LocalTime endTime = startTime.plusMinutes(haircutType.getDuration());

        validateBusinessRules(date, startTime, endTime);

        if (repository.hasConflict(barber.getId(), date, startTime, endTime)) {
            throw new IllegalStateException("Barber is already booked for this time slot");
        }

        Appointment appointment = Appointment.builder()
                .clientName(dto.clientName())
                .clientPhone(dto.clientPhone())
                .clientEmail(dto.clientEmail())
                .barber(barber)
                .haircutType(haircutType)
                .date(date)
                .startTime(startTime)
                .endTime(endTime)
                .status(AppointmentStatus.PENDING)
                .build();

        Appointment saved = repository.save(appointment);
        return toDTO(saved);
    }

    @Transactional
    public AppointmentDTO update(Long id, CreateAppointmentDTO dto) {
        Appointment existing = repository.findByIdWithBarberAndHaircutType(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + id));

        if (existing.getStatus() == AppointmentStatus.CANCELLED || existing.getStatus() == AppointmentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot update a " + existing.getStatus().name().toLowerCase() + " appointment");
        }

        Barber barber = barberRepository.findById(dto.barberId())
                .orElseThrow(() -> new EntityNotFoundException("Barber not found with id: " + dto.barberId()));

        if (!barber.getActive()) {
            throw new IllegalStateException("Barber is not active");
        }

        HaircutType haircutType = haircutTypeRepository.findById(dto.haircutTypeId())
                .orElseThrow(() -> new EntityNotFoundException("Haircut type not found with id: " + dto.haircutTypeId()));

        if (haircutType.getDuration() == null || haircutType.getDuration() <= 0) {
            throw new IllegalArgumentException("Haircut duration must be positive");
        }

        LocalDate date = LocalDate.parse(dto.date());
        LocalTime startTime = LocalTime.parse(dto.startTime());
        LocalTime endTime = startTime.plusMinutes(haircutType.getDuration());

        validateBusinessRules(date, startTime, endTime);

        Long existingId = existing.getId();
        if (repository.hasConflictExcludingId(barber.getId(), date, startTime, endTime, existingId)) {
            throw new IllegalStateException("Barber is already booked for this time slot");
        }

        existing.setClientName(dto.clientName());
        existing.setClientPhone(dto.clientPhone());
        existing.setClientEmail(dto.clientEmail());
        existing.setBarber(barber);
        existing.setHaircutType(haircutType);
        existing.setDate(date);
        existing.setStartTime(startTime);
        existing.setEndTime(endTime);

        Appointment saved = repository.save(existing);
        return toDTO(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Appointment not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private AppointmentDTO toDTO(Appointment a) {
        return new AppointmentDTO(
                a.getId(),
                a.getClientName(),
                a.getClientPhone(),
                a.getClientEmail(),
                a.getBarber().getId(),
                a.getHaircutType().getId(),
                a.getDate().toString(),
                a.getStartTime().toString(),
                a.getStatus().name()
        );
    }

    @Transactional
    public void confirm(Long id) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + id));

        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new IllegalStateException("Only pending appointments can be confirmed");
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        repository.save(appointment);
    }

    @Transactional
    public void cancel(Long id) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + id));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel a completed appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        repository.save(appointment);
    }

    private void validateBusinessRules(LocalDate date, LocalTime startTime, LocalTime endTime) {
        LocalDate today = LocalDate.now();

        if (date.isBefore(today)) {
            throw new IllegalArgumentException("Cannot book appointments in the past");
        }

        if (startTime.isBefore(BUSINESS_OPEN) || endTime.isAfter(BUSINESS_CLOSE)) {
            throw new IllegalArgumentException("Appointment must be within business hours (9:00 AM - 6:00 PM)");
        }
    }
}
