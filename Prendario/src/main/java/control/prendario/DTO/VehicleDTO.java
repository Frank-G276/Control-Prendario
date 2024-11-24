package control.prendario.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.ToString;

import java.util.Date;


@Schema(description = "DTO para la gestión de vehículos")
@Data
@ToString
public class VehicleDTO {
    @Schema(description = "ID del vehículo", example = "1")
    private Long idVehiculo;

    @Schema(description = "Tipo de vehículo", example = "AUTOMOVIL",
            allowableValues = {"AUTOMOVIL", "MOTOCICLETA", "CAMIONETA"})
    private String tipoVehiculo;

    @Schema(description = "Marca del vehículo", example = "Toyota")
    private String marca;

    @Schema(description = "Línea del vehículo", example = "Corolla")
    private String linea;

    @Schema(description = "Modelo (año) del vehículo", example = "2020")
    private Integer modelo;

    @Schema(description = "Placa del vehículo", example = "ABC123")
    private String placa;

    @Schema(description = "Cilindraje del vehículo", example = "2000")
    private Integer cilindraje;

    @Schema(description = "Color del vehículo", example = "Rojo")
    private String color;

    @Schema(description = "Número de motor", example = "MOT123456")
    private String numeroMotor;

    @Schema(description = "Número de chasis", example = "CHS789012")
    private String numeroChasis;

    @Schema(description = "Sitio de matrícula", example = "Bogotá")
    private String sitioMatricula;

    @Schema(description = "Fecha de matrícula", example = "2020-01-01")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date fechaMatricula;

    @Schema(description = "Nombre del propietario", example = "Juan Pérez")
    private String propietario;

    @Schema(description = "Número de documento del propietario", example = "12345678")
    private String numeroDocumentoPropietario;
}
