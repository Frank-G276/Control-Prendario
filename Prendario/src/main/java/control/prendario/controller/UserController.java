package control.prendario.controller;

import control.prendario.DTO.PasswordChangeDTO;
import control.prendario.DTO.UserCreationDTO;
import control.prendario.DTO.UserResponseDTO;
import control.prendario.DTO.UserUpdateDTO;
import control.prendario.model.Rol;
import control.prendario.model.Usuario;
import control.prendario.service.UserService;
import control.prendario.service.UserServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Usuarios", description = "Gestión de usuarios del sistema")
@SecurityRequirement(name = "JWT")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserServiceImpl userService;

    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @Operation(summary = "Crear nuevo usuario",
            description = "Crea un nuevo usuario en el sistema. Requiere rol de administrador.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuario creado exitosamente",
                    content = @Content(schema = @Schema(implementation = UserResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos inválidos",
                    content = @Content(schema = @Schema(
                            type = "object",
                            example = "{\"email\": \"Email inválido\", \"password\": \"La contraseña es requerida\"}"
                    ))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "No tiene permisos de administrador"
            )
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createUser(
            @Parameter(description = "Datos del nuevo usuario", required = true)
            @Valid @RequestBody UserCreationDTO userDTO,
            BindingResult result) {
        logger.debug("Recibiendo solicitud para crear usuario: {}", userDTO.getEmail());

        // Validar errores de campo
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        // Validar que las contraseñas coincidan
        if (!userDTO.getPassword().equals(userDTO.getConfirmPassword())) {
            Map<String, String> errors = new HashMap<>();
            errors.put("confirmPassword", "Las contraseñas no coinciden");
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            Usuario newUser = userService.crearUsuario(
                    userDTO.getEmail(),
                    userDTO.getPassword(),
                    userDTO.getNombre(),
                    userDTO.getRoles().stream()
                            .map(Rol::valueOf)
                            .collect(Collectors.toSet())
            );

            return ResponseEntity.ok(new UserResponseDTO(newUser));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Rol inválido: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @Operation(summary = "Obtener todos los usuarios",
            description = "Lista todos los usuarios del sistema. Requiere rol de administrador.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de usuarios obtenida exitosamente",
                    content = @Content(schema = @Schema(
                            type = "array",
                            implementation = UserResponseDTO.class
                    ))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "No tiene permisos de administrador"
            )
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.listarTodos().stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Obtener usuario por ID",
            description = "Obtiene los detalles de un usuario específico. Requiere rol de administrador.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuario encontrado",
                    content = @Content(schema = @Schema(implementation = UserResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuario no encontrado"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "No tiene permisos de administrador"
            )
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(
            @Parameter(description = "ID del usuario", required = true, example = "1")
            @PathVariable Long id) {
        try {
            Usuario user = userService.buscarPorId(id);
            return ResponseEntity.ok(new UserResponseDTO(user));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Actualizar usuario",
            description = "Actualiza la información de un usuario existente. Requiere rol de administrador.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuario actualizado exitosamente",
                    content = @Content(schema = @Schema(implementation = UserResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos inválidos"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuario no encontrado"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "No tiene permisos de administrador"
            )
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(
            @Parameter(description = "ID del usuario", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Datos actualizados del usuario", required = true)
            @Valid @RequestBody UserUpdateDTO updateDTO) {
        try {
            Usuario updatedUser = userService.actualizarUsuario(
                    id,
                    updateDTO.getNombre(),
                    updateDTO.getRoles().stream()
                            .map(Rol::valueOf)
                            .collect(java.util.stream.Collectors.toSet())
            );
            return ResponseEntity.ok(new UserResponseDTO(updatedUser));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Desactivar usuario",
            description = "Desactiva un usuario del sistema. Requiere rol de administrador.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuario desactivado exitosamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuario no encontrado"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "No tiene permisos de administrador"
            )
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateUser(
            @Parameter(description = "ID del usuario a desactivar", required = true, example = "1")
            @PathVariable Long id) {
        try {
            userService.desactivarUsuario(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Activar usuario",
            description = "Activa un usuario previamente desactivado. Requiere rol de administrador.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuario activado exitosamente"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuario no encontrado"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "No tiene permisos de administrador"
            )
    })
    @PostMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateUser(
            @Parameter(description = "ID del usuario a activar", required = true, example = "1")
            @PathVariable Long id) {
        try {
            userService.activarUsuario(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Cambiar contraseña",
            description = "Cambia la contraseña de un usuario. Requiere rol de administrador.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Contraseña cambiada exitosamente"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Contraseña inválida"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuario no encontrado"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "No tiene permisos de administrador"
            )
    })
    @PostMapping("/{id}/change-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(
            @Parameter(description = "ID del usuario", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Nueva contraseña", required = true)
            @Valid @RequestBody PasswordChangeDTO passwordDTO) {
        try {
            userService.cambiarPassword(id, passwordDTO.getNewPassword());
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}