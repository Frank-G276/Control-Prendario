package control.prendario.controller;

import control.prendario.model.Pago;
import control.prendario.service.PagoService;
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
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Pagos",
        description = "API para la gestión de pagos de préstamos prendarios")
@SecurityRequirement(name = "JWT")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @Operation(summary = "Obtener todos los pagos",
            description = "Obtiene una lista de todos los pagos registrados en el sistema")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de pagos obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    type = "array",
                                    implementation = Pago.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "No tiene permisos para ver los pagos"
            )
    })
    @GetMapping
    public ResponseEntity<List<Pago>> obtenerTodosPagos() {
        return ResponseEntity.ok(pagoService.obtenerTodosPagos());
    }

    @Operation(summary = "Crear nuevo pago",
            description = "Registra un nuevo pago para un préstamo")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Pago registrado exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Pago.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos del pago inválidos",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    type = "object",
                                    example = "{\"error\": \"El monto del pago es requerido\"}"
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Préstamo no encontrado"
            )
    })
    @PostMapping
    public ResponseEntity<Pago> crearPago(
            @Parameter(
                    description = "Datos del pago a registrar",
                    required = true,
                    schema = @Schema(implementation = Pago.class)
            )
            @RequestBody Pago pago) {
        return ResponseEntity.ok(pagoService.crearPago(pago));
    }

    @Operation(summary = "Obtener pagos por préstamo",
            description = "Obtiene todos los pagos asociados a un préstamo específico")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de pagos del préstamo obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    type = "array",
                                    implementation = Pago.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Préstamo no encontrado"
            )
    })
    @GetMapping("/prestamo/{idPrestamo}")
    public ResponseEntity<List<Pago>> obtenerPagosPorPrestamo(
            @Parameter(
                    description = "ID del préstamo",
                    required = true,
                    example = "1"
            )
            @PathVariable Long idPrestamo) {
        return ResponseEntity.ok(pagoService.obtenerPagosPorPrestamo(idPrestamo));
    }

    @Operation(summary = "Obtener resumen de pagos",
            description = "Obtiene un resumen de los pagos realizados para un préstamo específico")
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
                            "totalPagado": "5000.00",
                            "totalCapital": "4000.00",
                            "totalInteres": "1000.00",
                            "totalMora": "0.00"
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
    @GetMapping("/prestamo/{idPrestamo}/resumen")
    public ResponseEntity<Map<String, BigDecimal>> obtenerResumenPagos(
            @Parameter(
                    description = "ID del préstamo",
                    required = true,
                    example = "1"
            )
            @PathVariable Long idPrestamo) {
        return ResponseEntity.ok(pagoService.obtenerResumenPagos(idPrestamo));
    }

    @Operation(summary = "Buscar pagos por cliente",
            description = "Busca pagos asociados a un cliente específico")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Búsqueda realizada exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    type = "array",
                                    implementation = Pago.class
                            )
                    )
            )
    })
    @GetMapping("/buscar")
    public ResponseEntity<List<Pago>> buscarPagosPorCliente(
            @Parameter(
                    description = "Término de búsqueda (nombre o documento del cliente)",
                    required = true,
                    example = "Juan Pérez"
            )
            @RequestParam String termino) {
        return ResponseEntity.ok(pagoService.buscarPagosPorCliente(termino));
    }
}