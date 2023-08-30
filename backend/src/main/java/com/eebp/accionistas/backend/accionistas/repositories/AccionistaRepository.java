package com.eebp.accionistas.backend.accionistas.repositories;

import com.eebp.accionistas.backend.accionistas.entities.Accionista;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AccionistaRepository extends JpaRepository<Accionista, String> {
    @Modifying
    @Transactional
    @Query(value = "UPDATE Accionista SET aprobado='S' WHERE codUsuario =:codigo")
    void aprobarAccionista(@Param("codigo") String codUsuario);

    @Modifying
    @Transactional
    @Query(value = "UPDATE Accionista SET aprobado='N', descripcionRechazo=:descripcion WHERE codUsuario =:codigo")
    void rechazarAccionista(@Param("codigo") String codUsuario, @Param("descripcion") String descripcionRechazo);
}
