package control.prendario.mapper;

import control.prendario.DTO.VehicleDTO;
import control.prendario.model.Vehicle;
import control.prendario.model.TipoVehiculo;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class VehicleMapper {

    public Vehicle toEntity(VehicleDTO dto) {
        if (dto == null) return null;

        Vehicle vehicle = new Vehicle();
        if (dto.getIdVehiculo() != null) {
            vehicle.setIdVehiculo(dto.getIdVehiculo());
        }

        vehicle.setTipoVehiculo(TipoVehiculo.valueOf(dto.getTipoVehiculo()));
        vehicle.setMarca(dto.getMarca());
        vehicle.setLinea(dto.getLinea());
        vehicle.setModelo(dto.getModelo());
        vehicle.setPlaca(dto.getPlaca());
        vehicle.setCilindraje(dto.getCilindraje());
        vehicle.setColor(dto.getColor());
        vehicle.setNumeroMotor(dto.getNumeroMotor());
        vehicle.setNumeroChasis(dto.getNumeroChasis());
        vehicle.setSitioMatricula(dto.getSitioMatricula());
        vehicle.setFechaMatricula(dto.getFechaMatricula()); // Ya no necesitamos conversión
        vehicle.setPropietario(dto.getPropietario());
        vehicle.setNumeroDocumentoPropietario(dto.getNumeroDocumentoPropietario());

        return vehicle;
    }

    public VehicleDTO toDTO(Vehicle entity) {
        if (entity == null) return null;

        VehicleDTO dto = new VehicleDTO();
        dto.setIdVehiculo(entity.getIdVehiculo());
        dto.setTipoVehiculo(entity.getTipoVehiculo().name());
        dto.setMarca(entity.getMarca());
        dto.setLinea(entity.getLinea());
        dto.setModelo(entity.getModelo());
        dto.setPlaca(entity.getPlaca());
        dto.setCilindraje(entity.getCilindraje());
        dto.setColor(entity.getColor());
        dto.setNumeroMotor(entity.getNumeroMotor());
        dto.setNumeroChasis(entity.getNumeroChasis());
        dto.setSitioMatricula(entity.getSitioMatricula());
        dto.setFechaMatricula(entity.getFechaMatricula()); // Ya no necesitamos conversión
        dto.setPropietario(entity.getPropietario());
        dto.setNumeroDocumentoPropietario(entity.getNumeroDocumentoPropietario());

        return dto;
    }
}