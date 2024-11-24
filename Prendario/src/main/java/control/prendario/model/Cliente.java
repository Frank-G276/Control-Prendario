package control.prendario.model;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Schema(description = "Entidad que representa un cliente en el sistema")
@Entity
@Table(name = "clientes")
@Data
public class Cliente {
    @Schema(description = "Identificador único del cliente", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long idCliente;

    @Schema(description = "Tipo de documento de identidad",
            allowableValues = {"DNI", "PASAPORTE", "CEDULA"},
            example = "CEDULA")
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento")
    private TipoDocumento tipoDocumento;

    @Schema(description = "Número de documento de identidad", example = "12345678")
    @Column(name = "numero_documento", unique = true)
    private String numeroDocumento;

    @Schema(description = "Nombres del cliente", example = "Juan Carlos")
    private String nombres;

    @Schema(description = "Apellidos del cliente", example = "Pérez González")
    private String apellidos;

    @Schema(description = "Fecha de nacimiento", example = "1990-01-01")
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Schema(description = "Dirección del cliente", example = "Calle 123 #45-67")
    private String direccion;

    @Schema(description = "Ciudad de residencia", example = "Bogotá")
    private String ciudad;

    @Schema(description = "Número de teléfono", example = "3001234567")
    private String telefono;

    @Schema(description = "Correo electrónico", example = "juan.perez@email.com")
    private String email;

    @Schema(description = "Fecha de registro en el sistema")
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
}

 enum TipoDocumento {
    DNI, PASAPORTE, CEDULA
}

