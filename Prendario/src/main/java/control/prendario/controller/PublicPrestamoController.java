package control.prendario.controller;

import control.prendario.model.Prestamo;
import control.prendario.service.PrestamoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/prestamos")
@CrossOrigin(origins = "http://localhost:4200")
public class PublicPrestamoController {

    @Autowired
    private PrestamoService prestamoService;

    @GetMapping("/buscar")
    public ResponseEntity<List<Prestamo>> buscarPrestamos(
            @RequestParam(required = false) String termino,
            @RequestParam(required = false) String numeroDocumento) {
        return ResponseEntity.ok(prestamoService.buscarPorFiltros(termino, numeroDocumento));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prestamo> getPrestamoById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(prestamoService.getPrestamoById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}