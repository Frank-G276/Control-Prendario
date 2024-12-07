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
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prestamo_maquina")
    private Long idPrestamoMaquina;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @Column(name = "tipo_maquina")
    private String tipoMaquina;

    @Column(name = "marca")
    private String marcaMaquina;

    @Column(name = "fecha_prestamo", updatable = false)
    private LocalDateTime fechaPrestamo;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(name = "monto_prestamo")
    private BigDecimal montoPrestamo;

    @Column(name = "tasa_interes")
    private BigDecimal tasaInteres;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_prestamo")
    private EstadoPrestamo estadoPrestamo = EstadoPrestamo.ACTIVO;

    @Column(columnDefinition = "TEXT")
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