package control.prendario.DTO;


import control.prendario.model.EstadoPrestamo;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import lombok.Data;

import java.math.BigDecimal;

@Schema(description = "DTO para la creación y actualización de préstamos de maquinas")
@Data
public class PrestamoMaquinaDTO {
    @Schema(description = "ID del cliente asociado al préstamo", example = "1")
    private Long idCliente;

    @Schema(description = "Tipo de la maquina del prestamo")
    private String tipoMaquina;

    @Schema(description = "Marca de la maquina del prestamo")
    private String marcaMaquina;

    @Schema(description = "Monto del préstamo", example = "5000000.00")
    private BigDecimal montoPrestamo;

    @Schema(description = "Tasa de interés mensual", example = "12.5")
    private BigDecimal tasaInteres;

    @Schema(description = "Observaciones adicionales del préstamo",
            example = "Préstamo con garantía de vehículo modelo 2020")
    private String observaciones;

    @Schema(description = "Estado actual del préstamo", example = "ACTIVO",
            allowableValues = {"ACTIVO", "VENCIDO", "PAGADO", "CANCELADO"})
    private EstadoPrestamo estadoPrestamo;
}
