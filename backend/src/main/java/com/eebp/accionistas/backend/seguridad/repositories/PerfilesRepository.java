package com.eebp.accionistas.backend.seguridad.repositories;

import com.eebp.accionistas.backend.seguridad.entities.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PerfilesRepository extends JpaRepository<Perfil, Integer> {
}
