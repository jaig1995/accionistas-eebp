package com.eebp.accionistas.backend.accionistas.services;

import com.eebp.accionistas.backend.accionistas.entities.Accionista;
import com.eebp.accionistas.backend.accionistas.repositories.AccionistaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

@Service
public class AccionistaService {

    @Autowired
    AccionistaRepository accionistaRepository;

    public Accionista addAccionista(Accionista accionista) {
        accionista.setAprobado("N");
        accionista.setTipoAccionista(1);
        return accionistaRepository.save(accionista);
    }

    public void aprobarAccionista(String codUsuario) {
        accionistaRepository.aprobarAccionista(codUsuario);
    }
}
