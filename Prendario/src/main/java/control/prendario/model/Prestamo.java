package control.prendario.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Schema(description = "Entidad que representa un préstamo prendario")
@Entity
@Table(name = "prestamos")
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Prestamo {

    @Schema(description = "Identificador único del préstamo", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prestamo")
    private Long idPrestamo;

    @Schema(description = "Cliente asociado al préstamo")
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @Schema(description = "Lista de pagos realizados")
    @OneToMany(mappedBy = "prestamo")
    @JsonIgnore // Ignora la lista de pagos al serializar
    private List<Pago> pagos;

    @Schema(description = "Vehículo en garantía")
    @ManyToOne
    @JoinColumn(name = "id_vehiculo")
    private Vehicle vehiculo;

    @Schema(description = "Monto del préstamo", example = "10000.00")
    @Column(name = "fecha_prestamo")
    private LocalDateTime fechaPrestamo;

    @Schema(description = "Fecha de vencimiento del prestamo")
    @Column(name = "fecha_vencimiento")
    private LocalDateTime fechaVencimiento;

    @Schema(description = "Monto del prestamo")
    @Column(name = "monto_prestamo")
    private BigDecimal montoPrestamo;

    @Schema(description = "Tasa de interés anual", example = "5.0")
    @Column(name = "tasa_interes")
    private BigDecimal tasaInteres;

    @Schema(description = "Estado actual del préstamo",
            allowableValues = {"ACTIVO", "VENCIDO", "PAGADO"},
            example = "ACTIVO")
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_prestamo")
    private EstadoPrestamo estadoPrestamo = EstadoPrestamo.ACTIVO;

    @Schema(description = "Observaciones del prestamo")
    private String observaciones;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        fechaPrestamo = LocalDateTime.now();
        // Establecer fecha de vencimiento a 3 meses después
        fechaVencimiento = fechaPrestamo.plusMonths(3);
        // Establecer tasa de interés por defecto si no se ha establecido
        if (tasaInteres == null) {
            tasaInteres = new BigDecimal("5.0");
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


}
