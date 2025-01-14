package control.prendario.repository;

import control.prendario.model.Pago;
import control.prendario.model.Prestamo;
import control.prendario.model.PrestamoMaquina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrestamoMaquinaRepository extends JpaRepository<PrestamoMaquina, Long> {

    @Query("SELECT p FROM PrestamoMaquina p JOIN p.cliente c " +
            "WHERE LOWER(c.nombres) LIKE LOWER(CONCAT('%', :termino, '%')) " +
            "OR LOWER(c.apellidos) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<PrestamoMaquina> buscarPorCliente(String termino);

    @Query("SELECT p FROM PrestamoMaquina p JOIN p.cliente c " +
            "WHERE LOWER(c.nombres) LIKE LOWER(CONCAT('%', :termino, '%')) " +
            "OR LOWER(c.apellidos) LIKE LOWER(CONCAT('%', :termino, '%')) " +
            "OR LOWER(c.numeroDocumento) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<PrestamoMaquina> findByBusquedaGeneral(String termino);

    List<PrestamoMaquina> findByClienteNombresContainingIgnoreCaseOrClienteApellidosContainingIgnoreCase(String nombres, String apellidos);
    List<PrestamoMaquina> findByClienteNumeroDocumentoContaining(String numeroDocumento);

}
