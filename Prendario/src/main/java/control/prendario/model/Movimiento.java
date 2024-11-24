package control.prendario.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Schema(description = "Entidad que representa un movimiento financiero")
@Entity
@Table(name = "movimientos")
@Data
public class Movimiento {
    @Schema(description = "Identificador único del movimiento", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento")
    private Long idMovimiento;

    @Schema(description = "Fecha y hora del movimiento")
    @Column(name = "fecha_movimiento")
    private LocalDateTime fechaMovimiento;

    @Schema(description = "Tipo de movimiento",
            allowableValues = {"ENTRADA", "SALIDA"},
            example = "ENTRADA")
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_movimiento", nullable = false)
    private TipoMovimiento tipoMovimiento;

    @Schema(description = "Monto del movimiento", example = "1000.00")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monto;

    public enum TipoMovimiento {
        ENTRADA, SALIDA
    }

    @PrePersist
    protected void onCreate() {
        fechaMovimiento = LocalDateTime.now();
    }
}
