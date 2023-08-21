package com.eebp.accionistas.backend.geo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeoService {

    @Autowired
    DepartamentoRepository departamentoRepository;

    @Autowired
    MunicipioRepository municipioRepository;

    public List<Departamento> getDepartamentos() {
        return departamentoRepository.findAll();
    }

    public List<Municipio> getMunicipios() {
        return municipioRepository.findAll();
    }

    public List<Municipio> getMunicipiosByDepartamento(Integer codigoDepartamento) {
        return municipioRepository.findByDepartamentoCodigo(codigoDepartamento);
    }
}
