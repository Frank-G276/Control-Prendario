package control.prendario.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import java.util.Date;
import lombok.Data;
import lombok.ToString;

@Schema(description = "Entidad que representa un vehículo en garantía")
@Entity
@Table(name = "vehiculos")
@Data
@ToString
public class Vehicle {
    @Schema(description = "Identificador único del vehículo", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVehiculo;

    @Schema(description = "Tipo de vehículo",
            allowableValues = {"AUTOMOVIL", "MOTOCICLETA", "CAMIONETA"},
            example = "AUTOMOVIL")
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_vehiculo")
    private TipoVehiculo tipoVehiculo;

    @Schema(description = "Marca del vehículo", example = "Toyota")
    private String marca;

    @Schema(description = "Lineea del Vehículo")
    private String linea;

    @Schema(description = "Modelo del vehículo")
    private Integer modelo;

    @Schema(description = "Placa del vehículo", example = "ABC123")
    @Column(unique = true)
    private String placa;

    @Schema(description = "Cilindraje del vehículo")
    private Integer cilindraje;

    @Schema(description = "Color del vehículo")
    private String color;

    @Schema(description = "Número de motor", example = "MOT123456")
    @Column(name = "numero_motor")
    private String numeroMotor;

    @Schema(description = "Numero de Chasis")
    @Column(name = "numero_chasis")
    private String numeroChasis;

    @Schema(description = "Sitio de matricula")
    @Column(name = "sitio_matricula")
    private String sitioMatricula;

    @Schema(description = "Fecha de matricula")
    @Column(name = "fecha_matricula")
    @Temporal(TemporalType.DATE)
    private Date fechaMatricula;

    @Schema(description = "Nombre del propietario")
    private String propietario;

    @Schema(description = "Numero de documento del propietario")
    @Column(name = "numero_documento_propietario")
    private String numeroDocumentoPropietario;

    @Schema(description = "Fecha de registro del vehículo")
    @Column(name = "fecha_registro")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaRegistro;
}


