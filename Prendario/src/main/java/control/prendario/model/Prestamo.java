package control.prendario.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "prestamos")
public class Prestamo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prestamo")
    private Long idPrestamo;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_vehiculo")
    private Vehicle vehiculo;

    @Column(name = "fecha_prestamo")
    private LocalDateTime fechaPrestamo;

    @Column(name = "fecha_vencimiento")
    private LocalDateTime fechaVencimiento;

    @Column(name = "monto_prestamo")
    private BigDecimal montoPrestamo;

    @Column(name = "tasa_interes")
    private BigDecimal tasaInteres;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_prestamo")
    private EstadoPrestamo estadoPrestamo;

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
