package control.prendario.service;

import control.prendario.model.Movimiento;
import control.prendario.repository.MovimientoRepository;
import control.prendario.repository.PagoRepository;
import control.prendario.repository.PrestamoRepository;
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
    private PrestamoRepository prestamoRepository;

    public Movimiento crearMovimiento(Movimiento movimiento) {
        return movimientoRepository.save(movimiento);
    }

    public List<Movimiento> obtenerTodosMovimientos() {
        return movimientoRepository.findAllByOrderByFechaMovimientoDesc();
    }

    public BigDecimal obtenerBalance() {
        return movimientoRepository.calculateBalance();
    }

    public Map<String, BigDecimal> obtenerBalanceCompleto() {
        Map<String, BigDecimal> balance = new HashMap<>();

        // Obtener balance de movimientos
        BigDecimal balanceMovimientos = movimientoRepository.calculateBalance();

        // Obtener total de pagos
        BigDecimal totalPagos = pagoRepository.sumTotalPagos();
        if (totalPagos == null) totalPagos = BigDecimal.ZERO;

        // Obtener total de préstamos
        BigDecimal totalPrestamos = prestamoRepository.sumTotalPrestamos();
        if (totalPrestamos == null) totalPrestamos = BigDecimal.ZERO;

        // Calcular balance final
        BigDecimal balanceTotal = balanceMovimientos
                .add(totalPagos)
                .subtract(totalPrestamos);

        balance.put("movimientos", balanceMovimientos);
        balance.put("pagos", totalPagos);
        balance.put("prestamos", totalPrestamos);
        balance.put("total", balanceTotal);

        return balance;
    }
}
