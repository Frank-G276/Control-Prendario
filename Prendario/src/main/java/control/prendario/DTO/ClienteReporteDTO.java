package control.prendario.DTO;

import control.prendario.model.Cliente;
import lombok.Data;

@Data
public class ClienteReporteDTO {
    private String nombres;
    private String apellidos;
    private String numeroDocumento;
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