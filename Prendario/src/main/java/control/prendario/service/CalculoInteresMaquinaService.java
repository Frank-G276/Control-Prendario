package control.prendario.service;

import control.prendario.model.Pago;
import control.prendario.model.PagoMaquina;
import control.prendario.model.PrestamoMaquina;
import control.prendario.repository.PagoMaquinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class CalculoInteresMaquinaService {

    @Autowired
    private PagoMaquinaRepository pagoRepository;


    public BigDecimal calcularInteresPendiente(PrestamoMaquina prestamo, LocalDate fechaActual) {

        BigDecimal interesPrestamo = prestamo.getTasaInteres();
        BigDecimal capitalActual = prestamo.getMontoPrestamo();
        LocalDate fechaInicio = prestamo.getFechaPrestamo().toLocalDate();
        int numerodemeses = calcularMesesEntreFechas(fechaInicio, fechaActual);

        BigDecimal interesPendiente = BigDecimal.ZERO;
        //obtine los pagos y los filtra segun su tipo
        List<PagoMaquina> pagosOrdenados = pagoRepository.findByPrestamoMaquinaIdPrestamoMaquinaOrderByFechaPagoDesc(prestamo.getIdPrestamoMaquina());
        List<PagoMaquina> pagosCapital = pagosOrdenados.stream()
                .filter(pago -> pago.getTipoPago() == Pago.TipoPago.CAPITAL)
                .toList();
        List<PagoMaquina> pagosIntereses = pagosOrdenados.stream()
                .filter(pago -> pago.getTipoPago() == Pago.TipoPago.INTERES)
                .toList();

        for(int i = 0; i < numerodemeses; i++){
            interesPendiente = interesPendiente.add(capitalActual.multiply(interesPrestamo).divide(BigDecimal.valueOf(100)));
            //calcula el capital restante por meses
            if (pagosCapital != null && !pagosCapital.isEmpty()) {
                for (int j = 0; j < pagosCapital.size(); j++) {
                    PagoMaquina pago = pagosCapital.get(j);
                    if (pago.getFechaPago().toLocalDate().isAfter(fechaInicio.plusMonths(i )) && (
                            pago.getFechaPago().toLocalDate().isBefore(fechaInicio.plusMonths(i + 1)) ||
                                    pago.getFechaPago().toLocalDate().equals(fechaInicio.plusMonths(i + 1)))) {
                        capitalActual = capitalActual.subtract(pago.getMontoPagado());
                    }
                }
            }
            System.out.println("capital actual maquina : " + capitalActual + "---------------------------------------------------------------------------------------------------------------------------------------------------");

            //calcula el interes por mes
            if (pagosIntereses != null && !pagosIntereses.isEmpty()) {
                for (int j = 0; j < pagosIntereses.size(); j++) {
                    PagoMaquina pago = pagosIntereses.get(j);
                    if (pago.getFechaPago().toLocalDate().isAfter(fechaInicio.plusMonths(i )) && (
                            pago.getFechaPago().toLocalDate().isBefore(fechaInicio.plusMonths(i + 1)) ||
                                    pago.getFechaPago().toLocalDate().equals(fechaInicio.plusMonths(i + 1)))) {
                        interesPendiente = interesPendiente.subtract(pago.getMontoPagado());
                    }

                }
            }
            System.out.println("interes pendiente maquina : " + interesPendiente + "---------------------------------------------------------------------------------------------------------------------------------------------------");

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