package control.prendario.controller;

import control.prendario.DTO.VehicleDTO;
import control.prendario.model.Vehicle;
import control.prendario.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:4200")
public class VehicleController {

    private final VehicleService vehicleService;

    // Constructor injection instead of field injection
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    public ResponseEntity<?> createVehicle(@RequestBody VehicleDTO vehicleDTO) {
        try {
            System.out.println("Received DTO for creation: " + vehicleDTO);
            Vehicle savedVehicle = vehicleService.saveVehicle(vehicleDTO);
            return ResponseEntity.ok(savedVehicle);
        } catch (Exception e) {
            System.err.println("Error in controller (create): " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Error al crear el vehículo: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        try {
            List<Vehicle> vehicles = vehicleService.getAllVehicles();
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            System.err.println("Error getting all vehicles: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicleById(@PathVariable Long id) {
        try {
            Vehicle vehicle = vehicleService.getVehicleById(id);
            return ResponseEntity.ok(vehicle);
        } catch (Exception e) {
            System.err.println("Error getting vehicle by id: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Error al obtener el vehículo: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        try {
            vehicleService.deleteVehicle(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error deleting vehicle: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Error al eliminar el vehículo: " + e.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Long id, @RequestBody VehicleDTO vehicleDTO) {
        try {
            System.out.println("Updating vehicle with ID: " + id);
            System.out.println("Received DTO for update: " + vehicleDTO);

            // Set the ID in the DTO before updating
            vehicleDTO.setIdVehiculo(id);
            Vehicle updatedVehicle = vehicleService.updateVehicle(vehicleDTO);
            return ResponseEntity.ok(updatedVehicle);
        } catch (Exception e) {
            System.err.println("Error in controller (update): " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Error al actualizar el vehículo: " + e.getMessage());
        }
    }
}
