package control.prendario.repository;

import control.prendario.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    boolean existsByPlaca(String placa);
    Optional<Vehicle> findByPlaca(String placa);
}