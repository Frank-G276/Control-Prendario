package control.prendario.controller;

import control.prendario.DTO.PrestamoMaquinaDTO;
import control.prendario.model.PrestamoMaquina;
import control.prendario.service.PrestamoMaquinaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/prestamos-maquinas")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Préstamos de Máquinas",
        description = "API para la gestión de préstamos de máquinas")
@SecurityRequirement(name = "JWT")
public class PrestamoMaquinaController {

    @Autowired
    private PrestamoMaquinaService prestamoMaquinaService;

    @Operation(summary = "Crear nuevo préstamo de máquina",
            description = "Registra un nuevo préstamo de máquina en el sistema")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Préstamo de máquina creado exitosamente",
                    content = @Content(schema = @Schema(implementation = PrestamoMaquina.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos del préstamo inválidos"
            )
    })
    @PostMapping
    public ResponseEntity<?> crearPrestamoMaquina(
            @Parameter(description = "Datos del préstamo de máquina", required = true)
            @RequestBody PrestamoMaquinaDTO prestamo) {
        try {
            PrestamoMaquina nuevoPrestamo = prestamoMaquinaService.crearPrestamoMaquina(prestamo);
            return ResponseEntity.ok(nuevoPrestamo);
        } catch (Exception e) {
            System.out.println("Error creando el prestamo 12");
            return ResponseEntity.badRequest()
                    .body("Error al crear el préstamo: " + e.getMessage());
        }
    }

    @Operation(summary = "Obtener todos los préstamos de máquinas",
            description = "Obtiene una lista de todos los préstamos de máquinas registrados")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de préstamos obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "array", implementation = PrestamoMaquina.class)
                    )
            )
    })
    @GetMapping
    public ResponseEntity<List<PrestamoMaquina>> obtenerTodosPrestamosMaquina() {
        return ResponseEntity.ok(prestamoMaquinaService.obtenerTodosPrestamosMaquina());
    }

    @Operation(summary = "Obtener préstamo de máquina por ID",
            description = "Obtiene los detalles de un préstamo de máquina específico")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Préstamo encontrado",
                    content = @Content(schema = @Schema(implementation = PrestamoMaquina.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Préstamo no encontrado"
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPrestamoMaquinaPorId(
            @Parameter(description = "ID del préstamo", required = true, example = "1")
            @PathVariable Long id) {
        try {
            return ResponseEntity.ok(prestamoMaquinaService.obtenerPrestamoMaquinaPorId(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Actualizar préstamo de máquina",
            description = "Actualiza la información de un préstamo de máquina existente")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Préstamo actualizado exitosamente",
                    content = @Content(schema = @Schema(implementation = PrestamoMaquina.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Préstamo no encontrado"
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPrestamoMaquina(
            @Parameter(description = "ID del préstamo", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Datos actualizados del préstamo", required = true)
            @RequestBody PrestamoMaquina prestamo) {
        try {
            return ResponseEntity.ok(prestamoMaquinaService.actualizarPrestamoMaquina(id, prestamo));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al actualizar el préstamo: " + e.getMessage());
        }
    }

    @Operation(summary = "Eliminar préstamo de máquina",
            description = "Elimina un préstamo de máquina del sistema")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Préstamo eliminado exitosamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Préstamo no encontrado"
            )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPrestamoMaquina(
            @Parameter(description = "ID del préstamo a eliminar", required = true, example = "1")
            @PathVariable Long id) {
        try {
            prestamoMaquinaService.eliminarPrestamoMaquina(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al eliminar el préstamo: " + e.getMessage());
        }
    }

    @Operation(summary = "Buscar préstamos por cliente",
            description = "Busca préstamos de máquinas por nombre o apellido del cliente")
    @GetMapping("/buscar")
    public ResponseEntity<List<PrestamoMaquina>> buscarPrestamosPorCliente(
            @Parameter(description = "Término de búsqueda")
            @RequestParam String termino) {
        return ResponseEntity.ok(prestamoMaquinaService.buscarPorCliente(termino));
    }

    @Operation(summary = "Obtener préstamos vencidos",
            description = "Obtiene una lista de todos los préstamos de máquinas vencidos")
    @GetMapping("/vencidos")
    public ResponseEntity<List<PrestamoMaquina>> obtenerPrestamosVencidos() {
        return ResponseEntity.ok(prestamoMaquinaService.obtenerPrestamosVencidos());
    }
}