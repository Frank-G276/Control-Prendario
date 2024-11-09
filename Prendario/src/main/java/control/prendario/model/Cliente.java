package control.prendario.model;


import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long idCliente;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento")
    private TipoDocumento tipoDocumento;

    @Column(name = "numero_documento", unique = true)
    private String numeroDocumento;

    private String nombres;
    private String apellidos;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    private String direccion;
    private String ciudad;
    private String telefono;
    private String email;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
}

 enum TipoDocumento {
    DNI, PASAPORTE, CEDULA
}

