package control.prendario.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "Entidad que representa un préstamo de máquina")
@Entity
@Table(name = "prestamos_maquinas")
@Data
public class PrestamoMaquina {
    @Schema(description = "Identificador único del préstamo", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prestamo_maquina")
    private Long idPrestamoMaquina;

    @Schema(description = "Cliente asociado al préstamo")
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @Schema(description = "Tipo de maquina")
    @Column(name = "tipo_maquina")
    private String tipoMaquina;

    @Schema(description = "Maquina en garantía")
    @Column(name = "marca")
    private String marcaMaquina;

    @Schema(description = "Fecha del prestamo", example = "10000.00")
    @Column(name = "fecha_prestamo", updatable = false)
    private LocalDateTime fechaPrestamo;

    @Schema(description = "Fecha de vencimiento del prestamo")
    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Schema(description = "Monto del prestamo")
    @Column(name = "monto_prestamo")
    private BigDecimal montoPrestamo;

    @Schema(description = "Tasa de interés anual", example = "5.0")
    @Column(name = "tasa_interes")
    private BigDecimal tasaInteres;

    @Schema(description = "Estado actual del préstamo",
            allowableValues = {"ACTIVO", "VENCIDO", "PAGADO", "CANCELADO"},
            example = "ACTIVO")
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_prestamo")
    private EstadoPrestamo estadoPrestamo = EstadoPrestamo.ACTIVO;

    @Schema(description = "Observaciones del prestamo")
    private String observaciones;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        fechaPrestamo = LocalDateTime.now();
        fechaVencimiento = LocalDate.now().plusMonths(3);

        if (tasaInteres == null) {
            tasaInteres = new BigDecimal("5.0");
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}