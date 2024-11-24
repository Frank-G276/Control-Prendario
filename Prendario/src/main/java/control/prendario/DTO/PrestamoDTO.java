package control.prendario.DTO;

import control.prendario.model.EstadoPrestamo;
import control.prendario.model.Vehicle;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.math.BigDecimal;


@Schema(description = "DTO para la creación y actualización de préstamos")
@Data
public class PrestamoDTO {
    @Schema(description = "ID del cliente asociado al préstamo", example = "1")
    private Long idCliente;

    @Schema(description = "Información del vehículo en garantía")
    private VehicleDTO vehiculo;

    @Schema(description = "Monto del préstamo", example = "5000000.00")
    private BigDecimal montoPrestamo;

    @Schema(description = "Tasa de interés anual", example = "12.5")
    private BigDecimal tasaInteres;

    @Schema(description = "Observaciones adicionales del préstamo",
            example = "Préstamo con garantía de vehículo modelo 2020")
    private String observaciones;

    @Schema(description = "Estado actual del préstamo", example = "ACTIVO",
            allowableValues = {"ACTIVO", "VENCIDO", "PAGADO", "CANCELADO"})
    private EstadoPrestamo estadoPrestamo;
}
