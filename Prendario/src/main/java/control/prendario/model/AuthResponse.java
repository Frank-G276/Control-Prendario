package control.prendario.model;

import lombok.Data;

import java.util.List;

@Data
public class AuthResponse {
    private String token;
    private List<String> roles;
    private String username;
    private String nombre;;

    public AuthResponse(String token, List<String> roles, String username, String nombre) {
        this.token = token;
        this.roles = roles;
        this.username = username;
        this.nombre = nombre;
    }


}
