package com.barbershop.barber_booking_system.controllers;

import com.barbershop.barber_booking_system.dto.CreateHaircutTypeDTO;
import com.barbershop.barber_booking_system.dto.HaircutTypeDTO;
import com.barbershop.barber_booking_system.services.HaircutTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
    @RequestMapping("/api/haircuts")
@CrossOrigin(origins = "*")
public class HaircutTypeController {

    private final HaircutTypeService service;

    public HaircutTypeController(HaircutTypeService service) {
        this.service = service;
    }

    @GetMapping("/services")
    public ResponseEntity<List<HaircutTypeDTO>> services() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<HaircutTypeDTO> create(@RequestBody CreateHaircutTypeDTO dto) {
        return new ResponseEntity<>(service.create(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HaircutTypeDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HaircutTypeDTO> update(@PathVariable Long id, @RequestBody CreateHaircutTypeDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
