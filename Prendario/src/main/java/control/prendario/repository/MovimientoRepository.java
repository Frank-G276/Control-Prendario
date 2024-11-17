package control.prendario.repository;

import control.prendario.model.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {

    List<Movimiento> findAllByOrderByFechaMovimientoDesc();

    @Query("SELECT COALESCE(SUM(CASE WHEN m.tipoMovimiento = 'ENTRADA' THEN m.monto ELSE -m.monto END), 0) " +
            "FROM Movimiento m")
    BigDecimal calculateBalance();
}
