package control.prendario.repository;

import control.prendario.model.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {
    // Aquí puedes agregar métodos personalizados si los necesitas
}
