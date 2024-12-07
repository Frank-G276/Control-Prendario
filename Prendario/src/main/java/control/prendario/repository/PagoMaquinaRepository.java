package control.prendario.repository;

import control.prendario.model.Pago;
import control.prendario.model.PagoMaquina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PagoMaquinaRepository extends JpaRepository<PagoMaquina, Long> {
    List<PagoMaquina> findByPrestamoMaquinaIdPrestamoMaquinaOrderByFechaPagoDesc(Long idPrestamoMaquina);

    @Query("SELECT SUM(p.montoPagado) FROM PagoMaquina p " +
            "WHERE p.prestamoMaquina.idPrestamoMaquina = :idPrestamoMaquina " +
            "AND p.tipoPago = :tipoPago")
    BigDecimal sumMontoPagadoByPrestamoAndTipoPago(Long idPrestamoMaquina, Pago.TipoPago tipoPago);
}
