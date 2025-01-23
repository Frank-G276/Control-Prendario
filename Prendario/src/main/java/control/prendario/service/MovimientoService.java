package control.prendario.service;

import control.prendario.model.EstadoPrestamo;
import control.prendario.model.Movimiento;
import control.prendario.model.Pago;
import control.prendario.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MovimientoService {

    @Autowired
    private MovimientoRepository movimientoRepository;

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private PagoMaquinaRepository pagoMaquinaRepository;

    @Autowired
    private PrestamoRepository prestamoRepository;

    @Autowired
    private PrestamoMaquinaRepository prestamoMaquinaRepository;

    public Movimiento crearMovimiento(Movimiento movimiento) {
        return movimientoRepository.save(movimiento);
    }

    public List<Movimiento> obtenerTodosMovimientos() {
        return movimientoRepository.findAllByOrderByFechaMovimientoDesc();
    }

    public Map<String, BigDecimal> obtenerBalanceCompleto() {
        Map<String, BigDecimal> balance = new HashMap<>();

        BigDecimal totalInteres = pagoRepository.sumMontoPagadoByTipoPago(Pago.TipoPago.INTERES).add(pagoMaquinaRepository.sumMontoPagadoByTipoPago(Pago.TipoPago.INTERES));

        // Obtener balance de movimientos
        BigDecimal balanceMovimientos = movimientoRepository.calculateBalance();

        // Obtener total de pagos
        BigDecimal totalPagos = pagoRepository.sumTotalPagos().add(pagoMaquinaRepository.sumTotalPagos());
        if (totalPagos == null) totalPagos = BigDecimal.ZERO;

        // Obtener total de préstamos
        BigDecimal totalPrestamos = prestamoRepository.sumTotalPrestamos().add(prestamoMaquinaRepository.sumTotalPrestamos());
        if (totalPrestamos == null) totalPrestamos = BigDecimal.ZERO;

        //Obtener total de prestamos activos
        BigDecimal prestamosActivos = prestamoRepository.sumarMontosPorEstado(EstadoPrestamo.ACTIVO, EstadoPrestamo.VENCIDO).add(prestamoMaquinaRepository.sumarMontosPorEstado(EstadoPrestamo.ACTIVO, EstadoPrestamo.VENCIDO));

        // Calcular balance final
        BigDecimal balanceTotal = balanceMovimientos
                .add(totalPagos)
                .subtract(totalPrestamos);

        balance.put("movimientos", balanceMovimientos);
        balance.put("pagos", totalPagos);
        balance.put("interes", totalInteres);
        balance.put("prestamos", totalPrestamos);
        balance.put("activos", prestamosActivos);
        balance.put("total", balanceTotal);

        return balance;
    }
}
