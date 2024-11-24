package control.prendario.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;


@Schema(description = "DTO para la creación de usuarios")
@Data
public class UserCreationDTO {
    @Schema(description = "Correo electrónico del usuario",
            example = "usuario@ejemplo.com",
            required = true)
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe ser válido")
    private String email;

    @Schema(description = "Contraseña del usuario",
            example = "password123",
            required = true,
            minLength = 6)
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    @Schema(description = "Confirmación de la contraseña",
            example = "password123",
            required = true)
    @NotBlank(message = "La confirmación de contraseña es obligatoria")
    private String confirmPassword;

    @Schema(description = "Nombre completo del usuario",
            example = "Juan Pérez",
            required = true)
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @Schema(description = "Roles asignados al usuario",
            example = "[\"ADMIN\", \"USER\"]",
            required = true)
    @NotEmpty(message = "Debe seleccionar al menos un rol")
    private Set<String> roles;
}