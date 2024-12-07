package control.prendario.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(description = "Entidad que representa un pago de préstamo de máquina")
@Entity
@Table(name = "pagos_maquinas")
@Data
public class PagoMaquina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago_maquina")
    private Long idPagoMaquina;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_prestamo_maquina", nullable = false)
    private PrestamoMaquina prestamoMaquina;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    @Column(name = "monto_pagado", precision = 12, scale = 2, nullable = false)
    private BigDecimal montoPagado;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pago")
    private Pago.TipoPago tipoPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago")
    private Pago.MetodoPago metodoPago;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @PrePersist
    protected void onCreate() {
        fechaPago = LocalDateTime.now();
    }
}