package control.prendario.repository;

import control.prendario.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    List<Pago> findByPrestamoIdPrestamoOrderByFechaPagoDesc(Long idPrestamo);

    @Query("SELECT p FROM Pago p WHERE p.prestamo.cliente.nombres LIKE %:termino% " +
            "OR p.prestamo.cliente.apellidos LIKE %:termino% " +
            "OR p.prestamo.cliente.numeroDocumento LIKE %:termino%")
    List<Pago> buscarPorCliente(String termino);

    @Query("SELECT SUM(p.montoPagado) FROM Pago p WHERE p.prestamo.idPrestamo = :idPrestamo AND p.tipoPago = :tipoPago")
    BigDecimal sumMontoPagadoByPrestamoAndTipoPago(Long idPrestamo, Pago.TipoPago tipoPago);

    @Query("SELECT SUM(p.montoPagado) FROM Pago p WHERE  p.tipoPago = :tipoPago")
    BigDecimal sumMontoPagadoByTipoPago(Pago.TipoPago tipoPago);

    @Query("SELECT DISTINCT p FROM Pago p " +
            "LEFT JOIN FETCH p.prestamo pr " +
            "LEFT JOIN FETCH pr.cliente " +
            "ORDER BY p.fechaPago DESC")
    List<Pago> findAllPagosWithDetails();

    @Query("SELECT COALESCE(SUM(p.montoPagado), 0) FROM Pago p")
    BigDecimal sumTotalPagos();

    @Query("SELECT p FROM Pago p " +
            "WHERE p.prestamo.idPrestamo = :idPrestamo " +
            "AND p.tipoPago = :tipoPago")
    List<Pago> findByPrestamoAndTipoPago(
            @Param("idPrestamo") Long idPrestamo,
            @Param("tipoPago") Pago.TipoPago tipoPago
    );
}
