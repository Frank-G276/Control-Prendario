package control.prendario.DTO;

import control.prendario.model.Vehicle;
import lombok.Data;

import java.util.Date;

@Data
public class VehiculoReporteDTO {
    private String tipoVehiculo;
    private String marca;
    private String linea;
    private Integer modelo;
    private String placa;
    private Integer cilindraje;
    private String color;
    private String numeroMotor;
    private String numeroChasis;
    private String sitioMatricula;
    private Date fechaMatricula;
    private String propietario;

    public static VehiculoReporteDTO fromVehiculo(Vehicle vehiculo) {
        VehiculoReporteDTO dto = new VehiculoReporteDTO();
        dto.setTipoVehiculo(vehiculo.getTipoVehiculo().toString());
        dto.setMarca(vehiculo.getMarca());
        dto.setLinea(vehiculo.getLinea());
        dto.setModelo(vehiculo.getModelo());
        dto.setPlaca(vehiculo.getPlaca());
        dto.setCilindraje(vehiculo.getCilindraje());
        dto.setColor(vehiculo.getColor());
        dto.setNumeroMotor(vehiculo.getNumeroMotor());
        dto.setNumeroChasis(vehiculo.getNumeroChasis());
        dto.setSitioMatricula(vehiculo.getSitioMatricula());
        dto.setFechaMatricula(vehiculo.getFechaMatricula());
        dto.setPropietario(vehiculo.getPropietario());
        return dto;
    }
}
