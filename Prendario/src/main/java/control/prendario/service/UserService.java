package control.prendario.service;

import control.prendario.model.Rol;
import control.prendario.model.Usuario;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public interface UserService {
    Usuario crearUsuario(String email, String password, String nombre, Set<Rol> roles);
    Usuario actualizarUsuario(Long id, String nombre, Set<Rol> roles);
    void cambiarPassword(Long id, String nuevaPassword);
    void desactivarUsuario(Long id);
    Usuario buscarPorEmail(String email);
    List<Usuario> listarTodos();
    Usuario buscarPorId(Long id);
    boolean existeEmail(String email);
}
