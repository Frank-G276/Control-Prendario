package control.prendario.config;

import control.prendario.model.Rol;
import control.prendario.service.UserServiceImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UserServiceImpl userService) {
        return args -> {
            // Crear usuario admin si no existe
            try {
                userService.buscarPorEmail("admin@sistema.com");
            } catch (RuntimeException e) {
                userService.crearUsuario(
                        "admin@sistema.com",
                        "admin123",
                        "Administrador",
                        Set.of(Rol.ADMIN)
                );
            }

            // Crear usuario gerente si no existe
            try {
                userService.buscarPorEmail("gerente@sistema.com");
            } catch (RuntimeException e) {
                userService.crearUsuario(
                        "gerente@sistema.com",
                        "gerente123",
                        "Gerente",
                        Set.of(Rol.GERENTE)
                );
            }
        };
    }
}
