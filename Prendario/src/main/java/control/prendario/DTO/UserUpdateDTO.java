package control.prendario.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Set;

@Data
public class UserUpdateDTO {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotEmpty(message = "Debe seleccionar al menos un rol")
    private Set<String> roles;
}
