package com.eebp.accionistas.backend.seguridad.services;

import com.eebp.accionistas.backend.seguridad.entities.Perfil;

import java.util.List;

public interface PerfilesService {
    List<Perfil> obtenerPerfiles();
}
