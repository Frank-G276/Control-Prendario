package control.prendario.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Schema(description = "DTO para cambio de contraseña")
@Data
public class PasswordChangeDTO {
    @Schema(description = "Contraseña actual del usuario",
            example = "password123",
            required = true)
    @NotBlank(message = "La contraseña actual es obligatoria")
    private String currentPassword;

    @Schema(description = "Nueva contraseña del usuario",
            example = "newPassword123",
            required = true,
            minLength = 6)
    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String newPassword;

    @Schema(description = "Confirmación de la nueva contraseña",
            example = "newPassword123",
            required = true)
    @NotBlank(message = "La confirmación de la contraseña es obligatoria")
    private String confirmPassword;
}
