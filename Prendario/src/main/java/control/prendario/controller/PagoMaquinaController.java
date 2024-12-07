package control.prendario.controller;

import control.prendario.model.PagoMaquina;
import control.prendario.service.PagoMaquinaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos-maquinas")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Pagos de Máquinas",
        description = "API para la gestión de pagos de préstamos de máquinas")
@SecurityRequirement(name = "JWT")
public class PagoMaquinaController {

    @Autowired
    private PagoMaquinaService pagoMaquinaService;

    @Operation(summary = "Crear nuevo pago",
            description = "Registra un nuevo pago para un préstamo de máquina")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Pago registrado exitosamente",
                    content = @Content(schema = @Schema(implementation = PagoMaquina.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos del pago inválidos"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Préstamo no encontrado"
            )
    })
    @PostMapping
    public ResponseEntity<?> crearPago(
            @Parameter(description = "Datos del pago a registrar", required = true)
            @RequestBody PagoMaquina pago) {
        try {
            return ResponseEntity.ok(pagoMaquinaService.crearPago(pago));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al crear el pago: " + e.getMessage());
        }
    }

    @Operation(summary = "Obtener pagos por préstamo",
            description = "Obtiene todos los pagos asociados a un préstamo de máquina específico")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de pagos obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "array", implementation = PagoMaquina.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Préstamo no encontrado"
            )
    })
    @GetMapping("/prestamo/{idPrestamoMaquina}")
    public ResponseEntity<List<PagoMaquina>> obtenerPagosPorPrestamo(
            @Parameter(description = "ID del préstamo de máquina", required = true, example = "1")
            @PathVariable Long idPrestamoMaquina) {
        return ResponseEntity.ok(pagoMaquinaService.obtenerPagosPorPrestamoMaquina(idPrestamoMaquina));
    }

    @Operation(summary = "Obtener resumen de pagos",
            description = "Obtiene un resumen detallado de los pagos realizados para un préstamo de máquina")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Resumen de pagos obtenido exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    type = "object",
                                    example = """
                                    {
                                        "capitalTotal": "10000.00",
                                        "interesTotal": "1500.00",
                                        "capitalPagado": "5000.00",
                                        "interesPagado": "750.00",
                                        "capitalPendiente": "5000.00",
                                        "interesPendiente": "750.00"
                                    }
                                    """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Préstamo no encontrado"
            )
    })
    @GetMapping("/prestamo/{idPrestamoMaquina}/resumen")
    public ResponseEntity<Map<String, BigDecimal>> obtenerResumenPagos(
            @Parameter(description = "ID del préstamo de máquina", required = true, example = "1")
            @PathVariable Long idPrestamoMaquina) {
        try {
            return ResponseEntity.ok(pagoMaquinaService.obtenerResumenPagos(idPrestamoMaquina));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}