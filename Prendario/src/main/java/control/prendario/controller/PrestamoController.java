package control.prendario.controller;

import control.prendario.DTO.PrestamoDTO;
import control.prendario.model.Prestamo;
import control.prendario.service.PrestamoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prestamos")
@CrossOrigin(origins = "http://localhost:4200")
public class PrestamoController {

    @Autowired
    private PrestamoService prestamoService;

    @PostMapping
    public ResponseEntity<?> createPrestamo(@RequestBody PrestamoDTO prestamoDTO) {
        try {
            Prestamo savedPrestamo = prestamoService.savePrestamo(prestamoDTO);
            return ResponseEntity.ok(savedPrestamo);
        } catch (Exception e) {
            // Mejorar el mensaje de error
            String errorMessage = "Error al crear el préstamo: " + e.getMessage();
            return ResponseEntity.badRequest().body(errorMessage);
        }
    }

    @GetMapping
    public ResponseEntity<List<Prestamo>> getAllPrestamos() {
        return ResponseEntity.ok(prestamoService.getAllPrestamos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPrestamoById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(prestamoService.getPrestamoById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al obtener el préstamo: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePrestamo(@PathVariable Long id, @RequestBody PrestamoDTO prestamoDTO) {
        try {
            return ResponseEntity.ok(prestamoService.updatePrestamo(id, prestamoDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al actualizar el préstamo: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrestamo(@PathVariable Long id) {
        try {
            prestamoService.deletePrestamo(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al eliminar el préstamo: " + e.getMessage());
        }
    }
}
