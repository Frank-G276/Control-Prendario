package control.prendario.controller;

import control.prendario.model.Pago;
import control.prendario.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "http://localhost:4200")
public class PagoController {
    @Autowired
    private PagoService pagoService;

    @GetMapping
    public ResponseEntity<List<Pago>> obtenerTodosPagos() {
        return ResponseEntity.ok(pagoService.obtenerTodosPagos());
    }

    @PostMapping
    public ResponseEntity<Pago> crearPago(@RequestBody Pago pago) {
        return ResponseEntity.ok(pagoService.crearPago(pago));
    }

    @GetMapping("/prestamo/{idPrestamo}")
    public ResponseEntity<List<Pago>> obtenerPagosPorPrestamo(@PathVariable Long idPrestamo) {
        return ResponseEntity.ok(pagoService.obtenerPagosPorPrestamo(idPrestamo));
    }

    @GetMapping("/prestamo/{idPrestamo}/resumen")
    public ResponseEntity<Map<String, BigDecimal>> obtenerResumenPagos(@PathVariable Long idPrestamo) {
        return ResponseEntity.ok(pagoService.obtenerResumenPagos(idPrestamo));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Pago>> buscarPagosPorCliente(@RequestParam String termino) {
        return ResponseEntity.ok(pagoService.buscarPagosPorCliente(termino));
    }
}
