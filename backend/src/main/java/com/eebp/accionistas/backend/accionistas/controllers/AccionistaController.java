package com.eebp.accionistas.backend.accionistas.controllers;

import com.eebp.accionistas.backend.accionistas.entities.Accionista;
import com.eebp.accionistas.backend.accionistas.entities.request.AprobarAccionistaRequest;
import com.eebp.accionistas.backend.accionistas.services.AccionistaService;
import com.eebp.accionistas.backend.seguridad.exceptions.NewUserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/accionista")
public class AccionistaController {

    @Autowired
    AccionistaService accionistaService;

    @PostMapping
    public Accionista addAccionista(@RequestBody Accionista accionista) {
        return accionistaService.addAccionista(accionista);
    }

    @PostMapping("/aprobar")
    public void aprobarAccionista(@RequestBody AprobarAccionistaRequest aprobarAccionistaRequest) throws NewUserException {
        accionistaService.aprobarAccionista(aprobarAccionistaRequest);
    }
}
