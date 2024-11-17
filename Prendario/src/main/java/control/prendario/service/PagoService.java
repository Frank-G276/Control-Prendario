package control.prendario.service;

import control.prendario.model.EstadoPrestamo;
import control.prendario.model.Pago;
import control.prendario.model.Prestamo;
import control.prendario.repository.PagoRepository;
import control.prendario.repository.PrestamoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class PagoService {
    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private PrestamoRepository prestamoRepository;

    @Transactional
    public Pago crearPago(Pago pago) {
        Prestamo prestamo = prestamoRepository.findById(pago.getPrestamo().getIdPrestamo())
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        // Obtener totales actuales
        BigDecimal capitalPagado = pagoRepository.sumMontoPagadoByPrestamoAndTipoPago(
                prestamo.getIdPrestamo(),
                Pago.TipoPago.CAPITAL
        );
        BigDecimal interesPagado = pagoRepository.sumMontoPagadoByPrestamoAndTipoPago(
                prestamo.getIdPrestamo(),
                Pago.TipoPago.INTERES
        );

        // Si son null, inicializar en 0
        if (capitalPagado == null) capitalPagado = BigDecimal.ZERO;
        if (interesPagado == null) interesPagado = BigDecimal.ZERO;

        // Agregar el pago actual según su tipo
        if (pago.getTipoPago() == Pago.TipoPago.CAPITAL) {
            capitalPagado = capitalPagado.add(pago.getMontoPagado());
        } else if (pago.getTipoPago() == Pago.TipoPago.INTERES) {
            interesPagado = interesPagado.add(pago.getMontoPagado());
        }

        // Calcular el interés total esperado
        BigDecimal interesTotal = prestamo.getMontoPrestamo()
                .multiply(prestamo.getTasaInteres().multiply(new BigDecimal("3")))
                .divide(new BigDecimal("100"));

        // Verificar si con este pago se completa la deuda
        if (capitalPagado.compareTo(prestamo.getMontoPrestamo()) >= 0 &&
                interesPagado.compareTo(interesTotal) >= 0) {

            prestamo.setEstadoPrestamo(EstadoPrestamo.PAGADO);
            prestamoRepository.save(prestamo);
        }

        return pagoRepository.save(pago);
    }

    private Map<String, BigDecimal> calcularValoresPrestamo(Prestamo prestamo) {
        Map<String, BigDecimal> valores = new HashMap<>();

        // 1. Obtener todos los pagos existentes
        List<Pago> pagosCapital = pagoRepository.findByPrestamoAndTipoPago(
                prestamo.getIdPrestamo(),
                Pago.TipoPago.CAPITAL
        );
        List<Pago> pagosInteres = pagoRepository.findByPrestamoAndTipoPago(
                prestamo.getIdPrestamo(),
                Pago.TipoPago.INTERES
        );

        // 2. Calcular total pagado en capital
        BigDecimal capitalPagado = pagosCapital.stream()
                .map(Pago::getMontoPagado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Calcular total pagado en intereses
        BigDecimal interesPagado = pagosInteres.stream()
                .map(Pago::getMontoPagado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Calcular interés total del préstamo
        BigDecimal interesTotal = prestamo.getMontoPrestamo()
                .multiply(prestamo.getTasaInteres().multiply(new BigDecimal("3")))
                .divide(new BigDecimal("100"));

        // 5. Calcular pendientes
        BigDecimal capitalPendiente = prestamo.getMontoPrestamo().subtract(capitalPagado);
        BigDecimal interesPendiente = interesTotal.subtract(interesPagado);

        // 6. Guardar valores calculados
        valores.put("capitalTotal", prestamo.getMontoPrestamo());
        valores.put("interesTotal", interesTotal);
        valores.put("capitalPagado", capitalPagado);
        valores.put("interesPagado", interesPagado);
        valores.put("capitalPendiente", capitalPendiente);
        valores.put("interesPendiente", interesPendiente);

        return valores;
    }

    private void verificarPagoCompleto(Prestamo prestamo, Map<String, BigDecimal> resumenPagos, BigDecimal nuevoPago) {
        BigDecimal capitalPagado = resumenPagos.getOrDefault("capital", BigDecimal.ZERO).add(nuevoPago);
        BigDecimal interesPagado = resumenPagos.getOrDefault("interes", BigDecimal.ZERO);

        BigDecimal interesTotal = prestamo.getMontoPrestamo()
                .multiply(prestamo.getTasaInteres().multiply(new BigDecimal("3")))
                .divide(new BigDecimal("100"));

        if (capitalPagado.compareTo(prestamo.getMontoPrestamo()) >= 0 &&
                interesPagado.compareTo(interesTotal) >= 0) {
            prestamo.setEstadoPrestamo(EstadoPrestamo.PAGADO);
            prestamoRepository.save(prestamo);
        }
    }

    private void validarPagoCapital(Pago pago, Prestamo prestamo, Map<String, BigDecimal> resumenPagos) {
        BigDecimal capitalPagado = resumenPagos.getOrDefault("capital", BigDecimal.ZERO);
        BigDecimal capitalPendiente = prestamo.getMontoPrestamo().subtract(capitalPagado);

        if (pago.getMontoPagado().compareTo(capitalPendiente) > 0) {
            throw new RuntimeException("El monto del pago ($" + pago.getMontoPagado() +
                    ") excede el capital pendiente ($" + capitalPendiente + ")");
        }
    }

    private void validarPagoInteres(Pago pago, Prestamo prestamo, Map<String, BigDecimal> resumenPagos) {
        BigDecimal interesPagado = resumenPagos.getOrDefault("interes", BigDecimal.ZERO);
        BigDecimal interesTotal = prestamo.getMontoPrestamo()
                .multiply(prestamo.getTasaInteres().multiply(new BigDecimal("3")))
                .divide(new BigDecimal("100"));
        BigDecimal interesPendiente = interesTotal.subtract(interesPagado);

        if (pago.getMontoPagado().compareTo(interesPendiente) > 0) {
            throw new RuntimeException("El monto del pago ($" + pago.getMontoPagado() +
                    ") excede el interés pendiente ($" + interesPendiente + ")");
        }
    }


    public List<Pago> obtenerPagosPorPrestamo(Long idPrestamo) {
        return pagoRepository.findByPrestamoIdPrestamoOrderByFechaPagoDesc(idPrestamo);
    }

    public Map<String, BigDecimal> obtenerResumenPagos(Long idPrestamo) {
        Prestamo prestamo = prestamoRepository.findById(idPrestamo)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        // Obtener totales pagados
        BigDecimal capitalPagado = pagoRepository.sumMontoPagadoByPrestamoAndTipoPago(
                idPrestamo,
                Pago.TipoPago.CAPITAL
        );
        BigDecimal interesPagado = pagoRepository.sumMontoPagadoByPrestamoAndTipoPago(
                idPrestamo,
                Pago.TipoPago.INTERES
        );

        // Si son null, inicializar en 0
        if (capitalPagado == null) capitalPagado = BigDecimal.ZERO;
        if (interesPagado == null) interesPagado = BigDecimal.ZERO;

        // Calcular el interés total
        BigDecimal interesTotal = prestamo.getMontoPrestamo()
                .multiply(prestamo.getTasaInteres().multiply(new BigDecimal("3")))
                .divide(new BigDecimal("100"));

        // Calcular pendientes
        BigDecimal capitalPendiente = prestamo.getMontoPrestamo().subtract(capitalPagado);
        BigDecimal interesPendiente = interesTotal.subtract(interesPagado);

        Map<String, BigDecimal> resumen = new HashMap<>();
        resumen.put("capitalTotal", prestamo.getMontoPrestamo());
        resumen.put("interesTotal", interesTotal);
        resumen.put("capitalPagado", capitalPagado);
        resumen.put("interesPagado", interesPagado);
        resumen.put("capitalPendiente", capitalPendiente);
        resumen.put("interesPendiente", interesPendiente);

        return resumen;
    }

    public List<Pago> buscarPagosPorCliente(String termino) {
        return pagoRepository.buscarPorCliente(termino);
    }

    public List<Pago> obtenerTodosPagos() {
        return pagoRepository.findAllPagosWithDetails();
    }
}
