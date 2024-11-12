package control.prendario.model;

import jakarta.persistence.*;
import java.util.Date;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "vehiculos")
@Data
@ToString
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVehiculo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_vehiculo")
    private TipoVehiculo tipoVehiculo;

    private String marca;
    private String linea;
    private Integer modelo;

    @Column(unique = true)
    private String placa;

    private Integer cilindraje;
    private String color;

    @Column(name = "numero_motor")
    private String numeroMotor;

    @Column(name = "numero_chasis")
    private String numeroChasis;

    @Column(name = "sitio_matricula")
    private String sitioMatricula;

    @Column(name = "fecha_matricula")
    @Temporal(TemporalType.DATE)
    private Date fechaMatricula;

    private String propietario;

    @Column(name = "numero_documento_propietario")
    private String numeroDocumentoPropietario;

    @Column(name = "fecha_registro")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaRegistro;
}


