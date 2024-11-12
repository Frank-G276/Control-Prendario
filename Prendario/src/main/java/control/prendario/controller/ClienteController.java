package control.prendario.controller;


import control.prendario.model.Cliente;
import control.prendario.service.ClienteService;
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
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping
    public ResponseEntity<Cliente> crearCliente(@RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.guardarCliente(cliente));
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        return ResponseEntity.ok(clienteService.obtenerTodos());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Cliente>> buscarClientes(
            @RequestParam(required = false) String termino,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String numeroDocumento) {

        try {
            List<Cliente> resultados = new ArrayList<>();

            if (termino != null && !termino.trim().isEmpty()) {
                // Búsqueda combinada
                Set<Cliente> clientesUnicos = new LinkedHashSet<>();
                clientesUnicos.addAll(clienteService.buscarPorNombre(termino));
                clientesUnicos.addAll(clienteService.buscarPorNumeroDocumento(termino));
                resultados = new ArrayList<>(clientesUnicos);
            } else if (nombre != null || numeroDocumento != null) {
                // Búsqueda específica
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

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerCliente(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.obtenerPorId(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizarCliente(
            @PathVariable Long id,
            @RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.actualizarCliente(id, cliente));

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Long id) {
        if (clienteService.eliminarCliente(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }


}
