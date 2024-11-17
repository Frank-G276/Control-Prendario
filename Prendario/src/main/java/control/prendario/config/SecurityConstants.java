package control.prendario.config;

import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;

public class SecurityConstants {
    // Tiempo de expiración: 10 días
    public static final long JWT_EXPIRATION = 864_000_000;

    // Esta clave debe estar en un archivo de configuración seguro en producción
    private static final String SECRET_KEY = "jxgEQeXHuPq8VdbyYFNkANdudQ53YUn4bvtSpbSjZvjUkHPk89ZWxz38EG38NAnd";

    public static Key getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(
                Base64.getEncoder().encodeToString(SECRET_KEY.getBytes(StandardCharsets.UTF_8))
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
