package control.prendario.service;

import control.prendario.model.Pago;
import control.prendario.model.Prestamo;
import control.prendario.repository.PagoMaquinaRepository;
import control.prendario.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CalculoInteresService {

    @Autowired
    private PagoRepository pagoRepository;

    public BigDecimal calcularInteresPendiente(Prestamo prestamo, LocalDate fechaActual) {

        BigDecimal interesPrestamo = prestamo.getTasaInteres();
        BigDecimal capitalActual = prestamo.getMontoPrestamo();
        LocalDate fechaInicio = prestamo.getFechaPrestamo().toLocalDate();
        int numerodemeses = calcularMesesEntreFechas(fechaInicio, fechaActual);

        BigDecimal interesPendiente = BigDecimal.ZERO;
        //obtine los pagos y los filtra segun su tipo
        List<Pago> pagosOrdenados = pagoRepository.findByPrestamoIdPrestamoOrderByFechaPagoDesc(prestamo.getIdPrestamo());
        List<Pago> pagosCapital = pagosOrdenados.stream()
                .filter(pago -> pago.getTipoPago() == Pago.TipoPago.CAPITAL)
                .toList();
        List<Pago> pagosIntereses = pagosOrdenados.stream()
                .filter(pago -> pago.getTipoPago() == Pago.TipoPago.INTERES)
                .toList();

        for(int i = 0; i < numerodemeses; i++){
            interesPendiente = interesPendiente.add(capitalActual.multiply(interesPrestamo).divide(BigDecimal.valueOf(100)));
            //calcula el capital restante por meses
            if (pagosCapital != null && !pagosCapital.isEmpty()) {
                for (int j = 0; j < pagosCapital.size(); j++) {
                    Pago pago = pagosCapital.get(j);
                    if (pago.getFechaPago().toLocalDate().isAfter(fechaInicio.plusMonths(i)) &&
                            pago.getFechaPago().toLocalDate().isBefore(fechaInicio.plusMonths(i + 1))) {
                        capitalActual = capitalActual.subtract(pago.getMontoPagado());
                    }
                }
            }
            //calcula el interes por mes
            if (pagosIntereses != null && !pagosIntereses.isEmpty()) {
                for (int j = 0; j < pagosIntereses.size(); j++) {
                    Pago pago = pagosIntereses.get(j);
                    if (pago.getFechaPago().toLocalDate().isAfter(fechaInicio.plusMonths(i )) &&
                            pago.getFechaPago().toLocalDate().isBefore(fechaInicio.plusMonths(i + 1))) {
                        interesPendiente = interesPendiente.subtract(pago.getMontoPagado());
                    }
                }
            }
        }

        return interesPendiente;
    }

    private int calcularMesesEntreFechas(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("La fecha inicial no puede ser posterior a la fecha final");

        }
        // Si las fechas son del mismo mes y año, retorna 0
        if (startDate.getYear() == endDate.getYear() && startDate.getMonth() == endDate.getMonth()) {
            return 1;
        }

        // Calculamos los meses entre estas dos fechas
        return (int) ChronoUnit.MONTHS.between(startDate, endDate) + 1;
    }
}
