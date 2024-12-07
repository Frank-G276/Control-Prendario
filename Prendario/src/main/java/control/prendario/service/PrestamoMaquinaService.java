package control.prendario.service;

import control.prendario.DTO.PrestamoMaquinaDTO;
import control.prendario.model.*;
import control.prendario.repository.PrestamoMaquinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PrestamoMaquinaService {

    @Autowired
    private PrestamoMaquinaRepository prestamoMaquinaRepository;

    @Autowired
    private ClienteService clienteService;

    @Transactional
    public PrestamoMaquina crearPrestamoMaquina(PrestamoMaquinaDTO prestamo) {

        Cliente cliente = clienteService.obtenerPorId(prestamo.getIdCliente());

        // Crear el préstamo
        PrestamoMaquina prestamoMaquina = new PrestamoMaquina();
        prestamoMaquina.setCliente(cliente);
        prestamoMaquina.setTipoMaquina(prestamo.getTipoMaquina());
        prestamoMaquina.setMarcaMaquina(prestamo.getMarcaMaquina());
        prestamoMaquina.setMontoPrestamo(prestamo.getMontoPrestamo());
        prestamoMaquina.setTasaInteres(prestamo.getTasaInteres()!= null ? prestamo.getTasaInteres() : new java.math.BigDecimal("5.0")) ;
        prestamoMaquina.setObservaciones(prestamo.getObservaciones());
        prestamoMaquina.setEstadoPrestamo(prestamo.getEstadoPrestamo() != null ?
                prestamo.getEstadoPrestamo() :
                EstadoPrestamo.ACTIVO);



        return prestamoMaquinaRepository.save(prestamoMaquina);
    }

    public List<PrestamoMaquina> obtenerTodosPrestamosMaquina() {
        return prestamoMaquinaRepository.findAll();
    }

    public PrestamoMaquina obtenerPrestamoMaquinaPorId(Long id) {
        return prestamoMaquinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo de máquina no encontrado"));
    }

    @Transactional
    public PrestamoMaquina actualizarPrestamoMaquina(Long id, PrestamoMaquina prestamo) {
        PrestamoMaquina prestamoExistente = prestamoMaquinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo de máquina no encontrado"));

        // Actualizar campos permitidos
        if (prestamo.getMontoPrestamo() != null) {
            prestamoExistente.setMontoPrestamo(prestamo.getMontoPrestamo());
        }
        if (prestamo.getTasaInteres() != null) {
            prestamoExistente.setTasaInteres(prestamo.getTasaInteres());
        }
        if (prestamo.getObservaciones() != null) {
            prestamoExistente.setObservaciones(prestamo.getObservaciones());
        }
        if (prestamo.getEstadoPrestamo() != null) {
            prestamoExistente.setEstadoPrestamo(prestamo.getEstadoPrestamo());
        }
        if (prestamo.getFechaVencimiento() != null) {
            prestamoExistente.setFechaVencimiento(prestamo.getFechaVencimiento());
        }
        if (prestamo.getTipoMaquina() != null) {
            prestamoExistente.setTipoMaquina(prestamo.getTipoMaquina());
        }
        if(prestamo.getMarcaMaquina() != null){
            prestamoExistente.setMarcaMaquina((prestamo.getMarcaMaquina()));
        }

        // Actualizar cliente si se proporciona
        if (prestamo.getCliente() != null && prestamo.getCliente().getIdCliente() != null) {
            Cliente cliente = clienteService.obtenerPorId(prestamo.getCliente().getIdCliente());
            prestamoExistente.setCliente(cliente);
        }

        return prestamoMaquinaRepository.save(prestamoExistente);
    }

    public void eliminarPrestamoMaquina(Long id) {
        prestamoMaquinaRepository.deleteById(id);
    }

    public List<PrestamoMaquina> buscarPorCliente(String termino) {
        return prestamoMaquinaRepository.buscarPorCliente(termino);
    }

    public List<PrestamoMaquina> buscarPorNumeroDocumento(String numeroDocumento) {
        return prestamoMaquinaRepository.findByClienteNumeroDocumentoContaining(numeroDocumento);
    }

    public List<PrestamoMaquina> obtenerPrestamosVencidos() {
        LocalDateTime now = LocalDateTime.now();
        return prestamoMaquinaRepository.findAll().stream()
                .filter(prestamo ->
                        prestamo.getEstadoPrestamo() == EstadoPrestamo.ACTIVO &&
                                prestamo.getFechaVencimiento() != null &&
                                prestamo.getFechaVencimiento().isBefore(now.toLocalDate()))
                .toList();
    }
}