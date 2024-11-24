package control.prendario.controller;

import control.prendario.model.Cliente;
import control.prendario.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Clientes", description = "API para la gestión de clientes del sistema de préstamos prendarios")
@SecurityRequirement(name = "JWT")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @Operation(summary = "Crear nuevo cliente",
            description = "Crea un nuevo cliente en el sistema con la información proporcionada")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Cliente creado exitosamente",
                    content = @Content(schema = @Schema(implementation = Cliente.class))),
            @ApiResponse(responseCode = "400",
                    description = "Datos del cliente inválidos"),
            @ApiResponse(responseCode = "409",
                    description = "Ya existe un cliente con el mismo número de documento")
    })
    @PostMapping
    public ResponseEntity<Cliente> crearCliente(
            @Parameter(description = "Datos del cliente a crear", required = true)
            @RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.guardarCliente(cliente));
    }

    @Operation(summary = "Listar todos los clientes",
            description = "Obtiene una lista de todos los clientes registrados en el sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Lista de clientes obtenida exitosamente",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(type = "array", implementation = Cliente.class)))
    })
    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        return ResponseEntity.ok(clienteService.obtenerTodos());
    }

    @Operation(summary = "Buscar clientes",
            description = "Busca clientes por término general, nombre o número de documento")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Búsqueda realizada exitosamente",
                    content = @Content(schema = @Schema(type = "array",
                            implementation = Cliente.class))),
            @ApiResponse(responseCode = "400",
                    description = "Error en los parámetros de búsqueda")
    })
    @GetMapping("/buscar")
    public ResponseEntity<List<Cliente>> buscarClientes(
            @Parameter(description = "Término general de búsqueda")
            @RequestParam(required = false) String termino,

            @Parameter(description = "Nombre del cliente")
            @RequestParam(required = false) String nombre,

            @Parameter(description = "Número de documento del cliente")
            @RequestParam(required = false) String numeroDocumento) {
        try {
            List<Cliente> resultados = new ArrayList<>();

            if (termino != null && !termino.trim().isEmpty()) {
                Set<Cliente> clientesUnicos = new LinkedHashSet<>();
                clientesUnicos.addAll(clienteService.buscarPorNombre(termino));
                clientesUnicos.addAll(clienteService.buscarPorNumeroDocumento(termino));
                resultados = new ArrayList<>(clientesUnicos);
            } else if (nombre != null || numeroDocumento != null) {
                resultados = clienteService.buscar(
                        nombre != null ? nombre : "",
                        numeroDocumento != null ? numeroDocumento : ""
                );
            }

            return ResponseEntity.ok(resultados);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Obtener cliente por ID",
            description = "Obtiene los detalles de un cliente específico por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Cliente encontrado",
                    content = @Content(schema = @Schema(implementation = Cliente.class))),
            @ApiResponse(responseCode = "404",
                    description = "Cliente no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerCliente(
            @Parameter(description = "ID del cliente", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(clienteService.obtenerPorId(id));
    }

    @Operation(summary = "Actualizar cliente",
            description = "Actualiza la información de un cliente existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Cliente actualizado exitosamente",
                    content = @Content(schema = @Schema(implementation = Cliente.class))),
            @ApiResponse(responseCode = "400",
                    description = "Datos del cliente inválidos"),
            @ApiResponse(responseCode = "404",
                    description = "Cliente no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizarCliente(
            @Parameter(description = "ID del cliente a actualizar", required = true)
            @PathVariable Long id,
            @Parameter(description = "Nuevos datos del cliente", required = true)
            @RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.actualizarCliente(id, cliente));
    }

    @Operation(summary = "Eliminar cliente",
            description = "Elimina un cliente del sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Cliente eliminado exitosamente"),
            @ApiResponse(responseCode = "404",
                    description = "Cliente no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(
            @Parameter(description = "ID del cliente a eliminar", required = true)
            @PathVariable Long id) {
        if (clienteService.eliminarCliente(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}