package control.prendario.DTO;

import control.prendario.model.Prestamo;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PrestamoReporteDTO {
    private ClienteReporteDTO cliente;
    private VehiculoReporteDTO vehiculo;
    private BigDecimal montoPrestamo;
    private BigDecimal tasaInteres;
    private LocalDateTime fechaPrestamo;
    private LocalDateTime fechaVencimiento;

    public static PrestamoReporteDTO fromPrestamo(Prestamo prestamo) {
        PrestamoReporteDTO dto = new PrestamoReporteDTO();
        dto.setMontoPrestamo(prestamo.getMontoPrestamo());
        dto.setTasaInteres(prestamo.getTasaInteres());
        dto.setFechaPrestamo(prestamo.getFechaPrestamo());
        dto.setFechaVencimiento(prestamo.getFechaVencimiento());

        if (prestamo.getCliente() != null) {
            dto.setCliente(ClienteReporteDTO.fromCliente(prestamo.getCliente()));
        }

        if (prestamo.getVehiculo() != null) {
            dto.setVehiculo(VehiculoReporteDTO.fromVehiculo(prestamo.getVehiculo()));
        }

        return dto;
    }
}
