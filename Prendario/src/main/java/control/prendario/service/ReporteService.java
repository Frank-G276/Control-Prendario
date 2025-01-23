package control.prendario.service;

import control.prendario.model.Prestamo;
import control.prendario.model.PrestamoMaquina;
import control.prendario.repository.PrestamoMaquinaRepository;
import control.prendario.repository.PrestamoRepository;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimplePdfExporterConfiguration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

import static control.prendario.DTO.NumberToLetterConverter.convertNumberToLetter;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final PrestamoRepository prestamoRepository;
    private final PrestamoMaquinaRepository prestamoMaquinaRepository;

    public byte[] generarDocumentoEmpeno(Long idPrestamo) throws Exception {
        Prestamo prestamo = prestamoRepository.findById(idPrestamo)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        // Crear DTO plano para el reporte
        Map<String, Object> reportData = new HashMap<>();

        // Cliente
        Map<String, Object> cliente = new HashMap<>();
        cliente.put("nombres", prestamo.getCliente().getNombres());
        cliente.put("apellidos", prestamo.getCliente().getApellidos());
        cliente.put("ciudad", prestamo.getCliente().getCiudad());
        cliente.put("numeroDocumento", prestamo.getCliente().getNumeroDocumento());
        reportData.put("cliente", cliente);

        // Vehículo
        Map<String, Object> vehiculo = new HashMap<>();
        vehiculo.put("tipoVehiculo", prestamo.getVehiculo().getTipoVehiculo().toString());
        vehiculo.put("marca", prestamo.getVehiculo().getMarca());
        vehiculo.put("linea", prestamo.getVehiculo().getLinea());
        vehiculo.put("modelo", prestamo.getVehiculo().getModelo());
        vehiculo.put("placa", prestamo.getVehiculo().getPlaca());
        vehiculo.put("cilindraje", prestamo.getVehiculo().getCilindraje());
        vehiculo.put("color", prestamo.getVehiculo().getColor());
        vehiculo.put("numeroMotor", prestamo.getVehiculo().getNumeroMotor());
        vehiculo.put("numeroChasis", prestamo.getVehiculo().getNumeroChasis());
        vehiculo.put("sitioMatricula", prestamo.getVehiculo().getSitioMatricula());
        vehiculo.put("fechaMatricula", prestamo.getVehiculo().getFechaMatricula());
        vehiculo.put("propietario", prestamo.getVehiculo().getPropietario());
        reportData.put("vehiculo", vehiculo);

        // Datos del préstamo
        reportData.put("montoPrestamo", prestamo.getMontoPrestamo());
        reportData.put("tasaInteres", prestamo.getTasaInteres());
        reportData.put("fechaPrestamo", prestamo.getFechaPrestamo());
        reportData.put("fechaVencimiento", prestamo.getFechaVencimiento());

        // Parámetros
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("IMAGEN", new ClassPathResource("reportes/2.png").getInputStream());
        parameters.put("MONTO_LETRAS", convertNumberToLetter(prestamo.getMontoPrestamo().doubleValue()));

        // Generar reporte
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(Collections.singletonList(reportData));

        InputStream reportStream = new ClassPathResource("reportes/documento_empeno.jasper").getInputStream();
        JasperPrint jasperPrint = JasperFillManager.fillReport(reportStream, parameters, dataSource);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        JRPdfExporter exporter = new JRPdfExporter();

        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(baos));

        SimplePdfExporterConfiguration configuration = new SimplePdfExporterConfiguration();
        exporter.setConfiguration(configuration);

        exporter.exportReport();

        return baos.toByteArray();
    }

    public byte[] generarDocumentoEmpenoMaquina(Long idPrestamoMaquina) throws Exception {
        PrestamoMaquina prestamo = prestamoMaquinaRepository.findById(idPrestamoMaquina)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        // Crear DTO plano para el reporte
        Map<String, Object> reportData = new HashMap<>();

        // Cliente
        Map<String, Object> cliente = new HashMap<>();
        cliente.put("nombres", prestamo.getCliente().getNombres());
        cliente.put("apellidos", prestamo.getCliente().getApellidos());
        cliente.put("ciudad", prestamo.getCliente().getCiudad());
        cliente.put("numeroDocumento", prestamo.getCliente().getNumeroDocumento());
        reportData.put("cliente", cliente);

        // Maquina
        reportData.put("tipoMaquina", prestamo.getTipoMaquina());
        reportData.put("marcaMaquina", prestamo.getMarcaMaquina());

        // Datos del préstamo
        reportData.put("montoPrestamo", prestamo.getMontoPrestamo());
        reportData.put("tasaInteres", prestamo.getTasaInteres());
        reportData.put("fechaPrestamo", prestamo.getFechaPrestamo());
        reportData.put("fechaVencimiento", prestamo.getFechaVencimiento());

        // Parámetros
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("IMAGEN", new ClassPathResource("reportes/2.png").getInputStream());
        parameters.put("MONTO_LETRAS", convertNumberToLetter(prestamo.getMontoPrestamo().doubleValue()));

        // Generar reporte
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(Collections.singletonList(reportData));

        InputStream reportStream = new ClassPathResource("reportes/documento_maquina.jasper").getInputStream();
        JasperPrint jasperPrint = JasperFillManager.fillReport(reportStream, parameters, dataSource);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        JRPdfExporter exporter = new JRPdfExporter();

        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(baos));

        SimplePdfExporterConfiguration configuration = new SimplePdfExporterConfiguration();
        exporter.setConfiguration(configuration);

        exporter.exportReport();

        return baos.toByteArray();
    }
}