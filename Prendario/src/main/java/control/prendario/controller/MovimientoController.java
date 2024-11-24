package control.prendario.controller;

import control.prendario.model.Movimiento;
import control.prendario.service.MovimientoService;
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
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Movimientos",
        description = "API para la gestión de movimientos financieros del sistema")
@SecurityRequirement(name = "JWT")
public class MovimientoController {

    @Autowired
    private MovimientoService movimientoService;

    @Operation(summary = "Crear nuevo movimiento",
            description = "Registra un nuevo movimiento financiero en el sistema (entrada o salida)")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Movimiento creado exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Movimiento.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos del movimiento inválidos",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    type = "object",
                                    example = "{\"error\": \"El monto del movimiento es requerido\"}"
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "No tiene permisos para crear movimientos"
            )
    })
    @PostMapping
    public ResponseEntity<Movimiento> crearMovimiento(
            @Parameter(
                    description = "Datos del movimiento a crear",
                    required = true,
                    schema = @Schema(implementation = Movimiento.class)
            )
            @RequestBody Movimiento movimiento) {
        return ResponseEntity.ok(movimientoService.crearMovimiento(movimiento));
    }

    @Operation(summary = "Obtener todos los movimientos",
            description = "Obtiene una lista de todos los movimientos financieros registrados")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de movimientos obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    type = "array",
                                    implementation = Movimiento.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "No tiene permisos para ver los movimientos"
            )
    })
    @GetMapping
    public ResponseEntity<List<Movimiento>> obtenerMovimientos() {
        return ResponseEntity.ok(movimientoService.obtenerTodosMovimientos());
    }

    @Operation(summary = "Obtener balance completo",
            description = "Obtiene un resumen del balance financiero, incluyendo " +
                    "total de entradas, salidas y balance neto")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Balance obtenido exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    type = "object",
                                    example = """
                        {
                            "totalEntradas": "50000.00",
                            "totalSalidas": "30000.00",
                            "balanceNeto": "20000.00"
                        }
                    """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "No tiene permisos para ver el balance"
            )
    })
    @GetMapping("/balance")
    public ResponseEntity<Map<String, BigDecimal>> obtenerBalanceCompleto() {
        return ResponseEntity.ok(movimientoService.obtenerBalanceCompleto());
    }
}