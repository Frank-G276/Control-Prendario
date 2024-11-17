package control.prendario.DTO;

import control.prendario.model.Usuario;
import control.prendario.model.Rol;
import lombok.Data;

import java.util.Set;

@Data
public class UserResponseDTO {
    private Long id;
    private String email;
    private String nombre;
    private Set<String> roles;
    private boolean activo;

    // Constructor
    public UserResponseDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.email = usuario.getEmail();
        this.nombre = usuario.getNombre();
        this.roles = usuario.getRoles().stream()
                .map(Rol::name)
                .collect(java.util.stream.Collectors.toSet());
        this.activo = usuario.isActivo();
    }
}
