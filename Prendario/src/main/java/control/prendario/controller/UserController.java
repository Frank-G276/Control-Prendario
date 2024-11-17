package control.prendario.controller;

import control.prendario.DTO.PasswordChangeDTO;
import control.prendario.DTO.UserCreationDTO;
import control.prendario.DTO.UserResponseDTO;
import control.prendario.DTO.UserUpdateDTO;
import control.prendario.model.Rol;
import control.prendario.model.Usuario;
import control.prendario.service.UserService;
import control.prendario.service.UserServiceImpl;
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
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserServiceImpl userService;

    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserCreationDTO userDTO, BindingResult result) {
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

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.listarTodos().stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Usuario user = userService.buscarPorId(id);
            return ResponseEntity.ok(new UserResponseDTO(user));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
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

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
        try {
            userService.desactivarUsuario(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        try {
            userService.activarUsuario(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/change-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @Valid @RequestBody PasswordChangeDTO passwordDTO) {
        try {
            userService.cambiarPassword(id, passwordDTO.getNewPassword());
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}