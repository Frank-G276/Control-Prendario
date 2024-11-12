package control.prendario.service;

import control.prendario.DTO.VehicleDTO;
import control.prendario.mapper.VehicleMapper;
import control.prendario.model.TipoVehiculo;
import control.prendario.model.Vehicle;
import control.prendario.repository.VehicleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class VehicleService {

    @Autowired
    private VehicleMapper vehicleMapper;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Transactional
    public Vehicle saveVehicle(VehicleDTO vehicleDTO) {
        // Verificar si ya existe un vehículo con esa placa
        Optional<Vehicle> existingVehicle = vehicleRepository.findByPlaca(vehicleDTO.getPlaca());
        if (existingVehicle.isPresent()) {
            // Si existe, actualizamos sus datos
            Vehicle vehicle = existingVehicle.get();
            updateVehicleFromDTO(vehicle, vehicleDTO);
            return vehicleRepository.save(vehicle);
        }

        // Si no existe, creamos uno nuevo
        Vehicle vehicle = vehicleMapper.toEntity(vehicleDTO);
        return vehicleRepository.save(vehicle);
    }

    private boolean hasChanges(Vehicle vehicle, VehicleDTO dto) {
        return !Objects.equals(vehicle.getTipoVehiculo().name(), dto.getTipoVehiculo()) ||
                !Objects.equals(vehicle.getMarca(), dto.getMarca()) ||
                !Objects.equals(vehicle.getLinea(), dto.getLinea()) ||
                !Objects.equals(vehicle.getModelo(), dto.getModelo()) ||
                !Objects.equals(vehicle.getCilindraje(), dto.getCilindraje()) ||
                !Objects.equals(vehicle.getColor(), dto.getColor()) ||
                !Objects.equals(vehicle.getNumeroMotor(), dto.getNumeroMotor().toUpperCase()) ||
                !Objects.equals(vehicle.getNumeroChasis(), dto.getNumeroChasis().toUpperCase()) ||
                !Objects.equals(vehicle.getSitioMatricula(), dto.getSitioMatricula()) ||
                !Objects.equals(vehicle.getFechaMatricula(), dto.getFechaMatricula()) ||
                !Objects.equals(vehicle.getPropietario(), dto.getPropietario()) ||
                !Objects.equals(vehicle.getNumeroDocumentoPropietario(), dto.getNumeroDocumentoPropietario());
    }



    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    public boolean existsByPlaca(String placa) {
        return vehicleRepository.existsByPlaca(placa);
    }

    @Transactional
    public Vehicle updateVehicle(VehicleDTO vehicleDTO) {
        if (vehicleDTO.getIdVehiculo() == null) {
            throw new RuntimeException("No se puede actualizar un vehículo sin ID");
        }

        Vehicle existingVehicle = vehicleRepository.findById(vehicleDTO.getIdVehiculo())
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        // Si la placa está cambiando, verificar que no exista
        if (!existingVehicle.getPlaca().equalsIgnoreCase(vehicleDTO.getPlaca())) {
            vehicleRepository.findByPlaca(vehicleDTO.getPlaca())
                    .ifPresent(v -> {
                        throw new RuntimeException("Ya existe un vehículo con la placa: " + vehicleDTO.getPlaca());
                    });
        }

        updateVehicleFromDTO(existingVehicle, vehicleDTO);
        return vehicleRepository.save(existingVehicle);
    }


    private void updateVehicleFromDTO(Vehicle vehicle, VehicleDTO dto) {
        try {
            if (dto.getTipoVehiculo() != null) {
                vehicle.setTipoVehiculo(TipoVehiculo.valueOf(dto.getTipoVehiculo()));
            }
            if (dto.getMarca() != null) {
                vehicle.setMarca(dto.getMarca().toUpperCase());
            }
            if (dto.getLinea() != null) {
                vehicle.setLinea(dto.getLinea().toUpperCase());
            }
            if (dto.getModelo() != null) {
                vehicle.setModelo(dto.getModelo());
            }
            if (dto.getPlaca() != null) {
                vehicle.setPlaca(dto.getPlaca().toUpperCase());
            }
            if (dto.getCilindraje() != null) {
                vehicle.setCilindraje(dto.getCilindraje());
            }
            if (dto.getColor() != null) {
                vehicle.setColor(dto.getColor().toUpperCase());
            }
            if (dto.getNumeroMotor() != null) {
                vehicle.setNumeroMotor(dto.getNumeroMotor().toUpperCase());
            }
            if (dto.getNumeroChasis() != null) {
                vehicle.setNumeroChasis(dto.getNumeroChasis().toUpperCase());
            }
            if (dto.getSitioMatricula() != null) {
                vehicle.setSitioMatricula(dto.getSitioMatricula().toUpperCase());
            }
            if (dto.getFechaMatricula() != null) {
                vehicle.setFechaMatricula(dto.getFechaMatricula());
            }
            if (dto.getPropietario() != null) {
                vehicle.setPropietario(dto.getPropietario().toUpperCase());
            }
            if (dto.getNumeroDocumentoPropietario() != null) {
                vehicle.setNumeroDocumentoPropietario(dto.getNumeroDocumentoPropietario());
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Error al actualizar vehículo: " + e.getMessage());
        }
    }

    public Optional<Vehicle> findByPlaca(String placa) {
        return vehicleRepository.findByPlaca(placa);
    }


}
