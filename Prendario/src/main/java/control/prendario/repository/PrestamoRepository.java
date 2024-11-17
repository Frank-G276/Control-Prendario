package control.prendario.repository;

import control.prendario.model.EstadoPrestamo;
import control.prendario.model.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {

    @Query("SELECT p FROM Prestamo p JOIN p.cliente c " +
            "WHERE LOWER(c.nombres) LIKE LOWER(CONCAT('%', :termino, '%')) " +
            "OR LOWER(c.apellidos) LIKE LOWER(CONCAT('%', :termino, '%')) " +
            "OR LOWER(c.numeroDocumento) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Prestamo> findByBusquedaGeneral(String termino);

    @Query("SELECT p FROM Prestamo p JOIN p.cliente c " +
            "WHERE (:nombreCliente IS NULL OR " +
            "LOWER(CONCAT(c.nombres, ' ', c.apellidos)) LIKE LOWER(CONCAT('%', :nombreCliente, '%'))) " +
            "AND (:numeroDocumento IS NULL OR " +
            "LOWER(c.numeroDocumento) LIKE LOWER(CONCAT('%', :numeroDocumento, '%')))")
    List<Prestamo> findByFiltros(String nombreCliente, String numeroDocumento);

    @Query("SELECT COALESCE(SUM(p.montoPrestamo), 0) FROM Prestamo p")
    BigDecimal sumTotalPrestamos();

    List<Prestamo> findByEstadoPrestamo(EstadoPrestamo estadoPrestamo);

    List<Prestamo> findByClienteNombresContainingIgnoreCaseOrClienteApellidosContainingIgnoreCase(String nombres, String apellidos);
    List<Prestamo> findByClienteNumeroDocumentoContaining(String numeroDocumento);
}
