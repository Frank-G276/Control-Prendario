package control.prendario.controller;

import control.prendario.service.ReporteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@Tag(name = "Reportes",
        description = "API para la generación de reportes y documentos del sistema")
@SecurityRequirement(name = "JWT")
public class ReporteController {

    private final ReporteService reporteService;

    @Operation(summary = "Generar documento de empeño",
            description = "Genera un documento PDF con los detalles del empeño para un préstamo específico. " +
                    "Este documento incluye información del cliente, vehículo y condiciones del préstamo.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Documento generado exitosamente",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_PDF_VALUE,
                            schema = @Schema(
                                    type = "string",
                                    format = "binary",
                                    description = "Archivo PDF del documento de empeño"
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Préstamo no encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    type = "object",
                                    example = "{\"error\": \"Préstamo no encontrado\"}"
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Error interno al generar el documento",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    type = "object",
                                    example = "{\"error\": \"Error al generar el documento de empeño\"}"
                            )
                    )
            )
    })
    @GetMapping("/documento-empeno/{idPrestamo}")
    public ResponseEntity<byte[]> generarDocumentoEmpeno(
            @Parameter(
                    description = "ID del préstamo para generar el documento",
                    required = true,
                    example = "1",
                    schema = @Schema(type = "integer", format = "int64")
            )
            @PathVariable Long idPrestamo) {
        try {
            byte[] reporteBytes = reporteService.generarDocumentoEmpeno(idPrestamo);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "documento_empeno.pdf");

            return new ResponseEntity<>(reporteBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Generar documento de empeño",
            description = "Genera un documento PDF con los detalles del empeño para un préstamo específico. " +
                    "Este documento incluye información del cliente, maquina y condiciones del préstamo.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Documento generado exitosamente",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_PDF_VALUE,
                            schema = @Schema(
                                    type = "string",
                                    format = "binary",
                                    description = "Archivo PDF del documento de empeño"
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Préstamo no encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    type = "object",
                                    example = "{\"error\": \"Préstamo no encontrado\"}"
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Error interno al generar el documento",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    type = "object",
                                    example = "{\"error\": \"Error al generar el documento de empeño\"}"
                            )
                    )
            )
    })
    @GetMapping("/documento-maquina/{idPrestamoMaquina}")
    public ResponseEntity<byte[]> generarDocumentoEmpenoMaquina(
            @Parameter(
                    description = "ID del préstamo para generar el documento",
                    required = true,
                    example = "1",
                    schema = @Schema(type = "integer", format = "int64")
            )
            @PathVariable Long idPrestamoMaquina) {
        try {
            byte[] reporteBytes = reporteService.generarDocumentoEmpenoMaquina(idPrestamoMaquina);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "documento_maquina.pdf");

            return new ResponseEntity<>(reporteBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}