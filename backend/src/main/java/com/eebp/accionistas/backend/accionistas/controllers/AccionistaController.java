package com.eebp.accionistas.backend.accionistas.controllers;

import com.eebp.accionistas.backend.accionistas.entities.Accionista;
import com.eebp.accionistas.backend.accionistas.entities.LogRegistroAccionistas;
import com.eebp.accionistas.backend.accionistas.entities.request.AprobarAccionistaRequest;
import com.eebp.accionistas.backend.accionistas.entities.request.RechazarAccionistaRequest;
import com.eebp.accionistas.backend.accionistas.exceptions.AccionistaExistsException;
import com.eebp.accionistas.backend.accionistas.services.AccionistaService;
import com.eebp.accionistas.backend.accionistas.services.LogRegistroAccionistaService;
import com.eebp.accionistas.backend.seguridad.exceptions.NewUserException;
import com.eebp.accionistas.backend.seguridad.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/accionista")
public class AccionistaController {

    @Autowired
    AccionistaService accionistaService;

    @Autowired
    LogRegistroAccionistaService logRegistroAccionistaService;

    @PostMapping
    public Accionista addAccionista(@RequestBody Accionista accionista) throws AccionistaExistsException, UserNotFoundException {
        return accionistaService.addAccionista(accionista);
    }

    @PostMapping("/aprobar")
    public void aprobarAccionista(@RequestBody AprobarAccionistaRequest aprobarAccionistaRequest) throws NewUserException, UserNotFoundException {
        accionistaService.aprobarAccionista(aprobarAccionistaRequest);
    }

    @PostMapping("/rechazar")
    public void rechazarAccionista(@RequestBody RechazarAccionistaRequest rechazarAccionistaRequest) throws UserNotFoundException {
        accionistaService.rechazarAccionista(rechazarAccionistaRequest);
    }

    @GetMapping("/ruta/{codUsuario}")
    public List<LogRegistroAccionistas> obtenerLogRegistroAccionista(@PathVariable String codUsuario) {
        return logRegistroAccionistaService.getLogByCodUsuario(codUsuario);
    }
}
