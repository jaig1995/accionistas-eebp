package com.eebp.accionistas.backend.seguridad.services;

import com.eebp.accionistas.backend.seguridad.entities.Perfil;
import com.eebp.accionistas.backend.seguridad.repositories.PerfilesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PerfilesServiceImpl implements PerfilesService {

    @Autowired
    PerfilesRepository perfilesRepository;

    @Override
    public List<Perfil> obtenerPerfiles() {
        return perfilesRepository.findAll();
    }
}
