package control.prendario.DTO;

import control.prendario.model.EstadoPrestamo;
import control.prendario.model.Vehicle;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PrestamoDTO {
    private Long idCliente;
    private VehicleDTO vehiculo;  // Debe ser VehicleDTO, no Vehicle
    private BigDecimal montoPrestamo;
    private BigDecimal tasaInteres;
    private String observaciones;
    private EstadoPrestamo estadoPrestamo;
}
