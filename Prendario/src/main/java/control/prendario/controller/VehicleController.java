package control.prendario.controller;

import control.prendario.DTO.VehicleDTO;
import control.prendario.model.Vehicle;
import control.prendario.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Vehículos",
        description = "API para la gestión de vehículos en garantía")
@SecurityRequirement(name = "JWT")
@Validated
public class VehicleController {

    private static final Logger logger = LoggerFactory.getLogger(VehicleController.class);
    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @Operation(summary = "Crear nuevo vehículo",
            description = "Registra un nuevo vehículo en el sistema con la información proporcionada")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Vehículo creado exitosamente",
                    content = @Content(schema = @Schema(implementation = Vehicle.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos del vehículo inválidos",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    type = "object",
                                    example = "{\"error\": \"La placa ya está registrada\"}"
                            )
                    )
            )
    })
    @PostMapping
    public ResponseEntity<?> createVehicle(
            @Parameter(description = "Datos del vehículo a crear", required = true)
            @RequestBody @Validated VehicleDTO vehicleDTO) {
        try {
            logger.info("Recibiendo solicitud para crear vehículo: {}", vehicleDTO);
            Vehicle savedVehicle = vehicleService.saveVehicle(vehicleDTO);
            logger.info("Vehículo creado exitosamente con ID: {}", savedVehicle.getIdVehiculo());
            return ResponseEntity.ok(savedVehicle);
        } catch (Exception e) {
            logger.error("Error al crear vehículo: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Error al crear el vehículo: " + e.getMessage());
        }
    }

    @Operation(summary = "Obtener todos los vehículos",
            description = "Obtiene una lista de todos los vehículos registrados en el sistema")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de vehículos obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "array", implementation = Vehicle.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Error interno del servidor"
            )
    })
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        try {
            logger.info("Obteniendo lista de todos los vehículos");
            List<Vehicle> vehicles = vehicleService.getAllVehicles();
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            logger.error("Error al obtener vehículos: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @Operation(summary = "Obtener vehículo por ID",
            description = "Obtiene los detalles de un vehículo específico por su ID")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Vehículo encontrado",
                    content = @Content(schema = @Schema(implementation = Vehicle.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Vehículo no encontrado"
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicleById(
            @Parameter(description = "ID del vehículo", required = true, example = "1")
            @PathVariable Long id) {
        try {
            logger.info("Buscando vehículo con ID: {}", id);
            Vehicle vehicle = vehicleService.getVehicleById(id);
            return ResponseEntity.ok(vehicle);
        } catch (Exception e) {
            logger.error("Error al obtener vehículo {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Error al obtener el vehículo: " + e.getMessage());
        }
    }

    @Operation(summary = "Eliminar vehículo",
            description = "Elimina un vehículo del sistema")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Vehículo eliminado exitosamente"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "No se puede eliminar el vehículo"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Vehículo no encontrado"
            )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(
            @Parameter(description = "ID del vehículo a eliminar", required = true, example = "1")
            @PathVariable Long id) {
        try {
            logger.info("Eliminando vehículo con ID: {}", id);
            vehicleService.deleteVehicle(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error al eliminar vehículo {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Error al eliminar el vehículo: " + e.getMessage());
        }
    }

    @Operation(summary = "Actualizar vehículo",
            description = "Actualiza la información de un vehículo existente")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Vehículo actualizado exitosamente",
                    content = @Content(schema = @Schema(implementation = Vehicle.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos del vehículo inválidos"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Vehículo no encontrado"
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(
            @Parameter(description = "ID del vehículo a actualizar", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Datos actualizados del vehículo", required = true)
            @RequestBody @Validated VehicleDTO vehicleDTO) {
        try {
            logger.info("Actualizando vehículo con ID: {} - Datos: {}", id, vehicleDTO);
            vehicleDTO.setIdVehiculo(id);
            Vehicle updatedVehicle = vehicleService.updateVehicle(vehicleDTO);
            logger.info("Vehículo actualizado exitosamente: {}", updatedVehicle.getIdVehiculo());
            return ResponseEntity.ok(updatedVehicle);
        } catch (Exception e) {
            logger.error("Error al actualizar vehículo {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Error al actualizar el vehículo: " + e.getMessage());
        }
    }
}