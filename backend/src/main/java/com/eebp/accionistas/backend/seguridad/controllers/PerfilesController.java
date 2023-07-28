package com.eebp.accionistas.backend.seguridad.controllers;

import com.eebp.accionistas.backend.seguridad.entities.Perfil;
import com.eebp.accionistas.backend.seguridad.services.PerfilesServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seguridad/perfiles")
public class PerfilesController {

    @Autowired
    PerfilesServiceImpl perfilesService;

    @GetMapping
    public List<Perfil> obtenerPerfiles() {
        return perfilesService.obtenerPerfiles();
    }
}
