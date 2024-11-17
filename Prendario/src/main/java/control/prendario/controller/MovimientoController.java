package control.prendario.controller;

import control.prendario.model.Movimiento;
import control.prendario.service.MovimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = "http://localhost:4200")
public class MovimientoController {

    @Autowired
    private MovimientoService movimientoService;

    @PostMapping
    public ResponseEntity<Movimiento> crearMovimiento(@RequestBody Movimiento movimiento) {
        return ResponseEntity.ok(movimientoService.crearMovimiento(movimiento));
    }

    @GetMapping
    public ResponseEntity<List<Movimiento>> obtenerMovimientos() {
        return ResponseEntity.ok(movimientoService.obtenerTodosMovimientos());
    }

    @GetMapping("/balance")
    public ResponseEntity<Map<String, BigDecimal>> obtenerBalanceCompleto() {
        return ResponseEntity.ok(movimientoService.obtenerBalanceCompleto());
    }
}
