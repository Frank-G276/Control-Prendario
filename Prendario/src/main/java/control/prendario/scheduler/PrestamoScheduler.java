package control.prendario.scheduler;

import control.prendario.model.EstadoPrestamo;
import control.prendario.model.Prestamo;
import control.prendario.repository.PrestamoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class PrestamoScheduler {

    private static final Logger logger = LoggerFactory.getLogger(PrestamoScheduler.class);
    private final PrestamoRepository prestamoRepository;

    public PrestamoScheduler(PrestamoRepository prestamoRepository) {
        this.prestamoRepository = prestamoRepository;
    }

    @Scheduled(cron = "0 */30 * * * *") // Se ejecuta todos los días a medianoche
    @Transactional
    public void actualizarEstadosPrestamos() {
        logger.info("Iniciando actualización de estados de préstamos");

        LocalDateTime ahora = LocalDateTime.now();

        List<Prestamo> prestamosActivos = prestamoRepository.findByEstadoPrestamo(EstadoPrestamo.ACTIVO);

        int actualizados = 0;
        for (Prestamo prestamo : prestamosActivos) {
            if (prestamo.getFechaVencimiento() != null && prestamo.getFechaVencimiento().isBefore(ahora)) {
                prestamo.setEstadoPrestamo(EstadoPrestamo.VENCIDO);
                prestamoRepository.save(prestamo);
                actualizados++;

                logger.info("Préstamo ID {} marcado como VENCIDO", prestamo.getIdPrestamo());
            }
        }

        logger.info("Actualización completada. {} préstamos actualizados a estado VENCIDO", actualizados);
    }
}
