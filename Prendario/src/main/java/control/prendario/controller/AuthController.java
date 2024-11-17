package control.prendario.controller;

import control.prendario.config.JwtUtil;
import control.prendario.model.AuthResponse;
import control.prendario.model.LoginRequest;
import control.prendario.model.Usuario;
import control.prendario.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            List<String> roles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .map(role -> role.replace("ROLE_", ""))
                    .collect(Collectors.toList());

            // Obtener el usuario para acceder a su nombre
            Usuario usuario = userService.buscarPorEmail(loginRequest.getUsername());
            String token = jwtUtil.generateToken(loginRequest.getUsername(), roles);

            return ResponseEntity.ok(new AuthResponse(
                    token,
                    roles,
                    usuario.getEmail(),
                    usuario.getNombre()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error en la autenticación");
        }
    }
}
