package control.prendario.service;

import control.prendario.DTO.PrestamoDTO;
import control.prendario.DTO.VehicleDTO;
import control.prendario.mapper.VehicleMapper;
import control.prendario.model.Cliente;
import control.prendario.model.EstadoPrestamo;
import control.prendario.model.Prestamo;
import control.prendario.model.Vehicle;
import control.prendario.repository.PrestamoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrestamoService {
    @Autowired
    private PrestamoRepository prestamoRepository;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private VehicleMapper vehicleMapper;

    @Transactional
    public Prestamo savePrestamo(PrestamoDTO prestamoDTO) {
        // Obtener el cliente
        Cliente cliente = clienteService.obtenerPorId(prestamoDTO.getIdCliente());

        // Buscar primero si existe un vehículo con esa placa
        Vehicle vehiculo = vehicleService.findByPlaca(prestamoDTO.getVehiculo().getPlaca())
                .map(existingVehicle -> {
                    // Si existe, actualizamos sus datos
                    VehicleDTO updateDTO = prestamoDTO.getVehiculo();
                    updateDTO.setIdVehiculo(existingVehicle.getIdVehiculo());
                    return vehicleService.updateVehicle(updateDTO);
                })
                .orElseGet(() -> {
                    // Si no existe, creamos uno nuevo
                    return vehicleService.saveVehicle(prestamoDTO.getVehiculo());
                });

        // Crear el préstamo
        Prestamo prestamo = new Prestamo();
        prestamo.setCliente(cliente);
        prestamo.setVehiculo(vehiculo);
        prestamo.setMontoPrestamo(prestamoDTO.getMontoPrestamo());
        prestamo.setTasaInteres(prestamoDTO.getTasaInteres());
        prestamo.setObservaciones(prestamoDTO.getObservaciones());
        prestamo.setEstadoPrestamo(prestamoDTO.getEstadoPrestamo() != null ?
                prestamoDTO.getEstadoPrestamo() :
                EstadoPrestamo.ACTIVO);

        return prestamoRepository.save(prestamo);
    }


    public List<Prestamo> getAllPrestamos() {
        return prestamoRepository.findAllByOrderByIdPrestamoDesc();
    }

    public Prestamo getPrestamoById(Long id) {
        return prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
    }

    @Transactional
    public Prestamo updatePrestamo(Long id, PrestamoDTO prestamoDTO) {
        // Obtener el préstamo existente
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        // Actualizar datos del préstamo
        if (prestamoDTO.getMontoPrestamo() != null) {
            prestamo.setMontoPrestamo(prestamoDTO.getMontoPrestamo());
        }
        if (prestamoDTO.getTasaInteres() != null) {
            prestamo.setTasaInteres(prestamoDTO.getTasaInteres());
        }
        if (prestamoDTO.getObservaciones() != null) {
            prestamo.setObservaciones(prestamoDTO.getObservaciones());
        }
        if (prestamoDTO.getEstadoPrestamo() != null) {
            prestamo.setEstadoPrestamo(prestamoDTO.getEstadoPrestamo());
        }

        // Si hay datos de vehículo, actualizar el vehículo existente
        if (prestamoDTO.getVehiculo() != null) {
            // Asegurarse de que el ID del vehículo coincida con el vehículo existente
            VehicleDTO vehicleDTO = prestamoDTO.getVehiculo();
            vehicleDTO.setIdVehiculo(prestamo.getVehiculo().getIdVehiculo());

            // Actualizar el vehículo existente
            Vehicle updatedVehicle = vehicleService.updateVehicle(vehicleDTO);
            prestamo.setVehiculo(updatedVehicle);
        }

        // Si hay cambio de cliente
        if (prestamoDTO.getIdCliente() != null) {
            Cliente cliente = clienteService.obtenerPorId(prestamoDTO.getIdCliente());
            prestamo.setCliente(cliente);
        }

        return prestamoRepository.save(prestamo);
    }

    public void deletePrestamo(Long id) {
        prestamoRepository.deleteById(id);
    }

    public List<Prestamo> buscarPorTermino(String termino) {
        return prestamoRepository.findByBusquedaGeneral(termino);
    }

    public List<Prestamo> buscarPorFiltros(String termino, String numeroDocumento) {
        if (termino != null && !termino.isEmpty()) {
            return prestamoRepository.findByClienteNombresContainingIgnoreCaseOrClienteApellidosContainingIgnoreCase(termino, termino);
        } else if (numeroDocumento != null && !numeroDocumento.isEmpty()) {
            return prestamoRepository.findByClienteNumeroDocumentoContaining(numeroDocumento);
        }
        return getAllPrestamos();
    }

    public List<Prestamo> findPrestamosVencidos() {
        LocalDateTime now = LocalDateTime.now();
        return prestamoRepository.findAll().stream()
                .filter(prestamo ->
                        prestamo.getEstadoPrestamo() == EstadoPrestamo.ACTIVO &&
                                prestamo.getFechaVencimiento() != null &&
                                prestamo.getFechaVencimiento().isBefore(now))
                .collect(Collectors.toList());
    }

    public Long getUltimoIdPrestamo() {
        return prestamoRepository.findMaxId();
    }


}
