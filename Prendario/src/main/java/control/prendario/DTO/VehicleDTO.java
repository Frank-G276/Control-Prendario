package control.prendario.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.ToString;

import java.util.Date;

@Data
@ToString
public class VehicleDTO {
    private Long idVehiculo;
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

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date fechaMatricula;

    private String propietario;
    private String numeroDocumentoPropietario;
}
