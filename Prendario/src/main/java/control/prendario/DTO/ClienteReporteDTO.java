package control.prendario.DTO;

import control.prendario.model.Cliente;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description = "DTO para reportes de cliente")
@Data
public class ClienteReporteDTO {
    @Schema(description = "Nombres del cliente", example = "Juan Carlos")
    private String nombres;

    @Schema(description = "Apellidos del cliente", example = "Pérez González")
    private String apellidos;

    @Schema(description = "Número de documento del cliente", example = "12345678")
    private String numeroDocumento;

    @Schema(description = "Ciudad de residencia del cliente", example = "Bogotá")
    private String ciudad;

    public static ClienteReporteDTO fromCliente(Cliente cliente) {
        ClienteReporteDTO dto = new ClienteReporteDTO();
        dto.setNombres(cliente.getNombres());
        dto.setApellidos(cliente.getApellidos());
        dto.setNumeroDocumento(cliente.getNumeroDocumento());
        dto.setCiudad(cliente.getCiudad());
        return dto;
    }
}