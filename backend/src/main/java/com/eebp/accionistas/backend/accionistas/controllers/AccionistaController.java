package com.eebp.accionistas.backend.accionistas.controllers;

import com.eebp.accionistas.backend.accionistas.entities.Accionista;
import com.eebp.accionistas.backend.accionistas.entities.LogRegistroAccionistas;
import com.eebp.accionistas.backend.accionistas.entities.request.ActualizarRepresentanteRequest;
import com.eebp.accionistas.backend.accionistas.entities.request.AprobarAccionistaRequest;
import com.eebp.accionistas.backend.accionistas.entities.request.RechazarAccionistaRequest;
import com.eebp.accionistas.backend.accionistas.entities.response.AccionistaRepresentanteResponse;
import com.eebp.accionistas.backend.accionistas.exceptions.AccionistaExistsException;
import com.eebp.accionistas.backend.accionistas.services.AccionistaService;
import com.eebp.accionistas.backend.accionistas.services.LogRegistroAccionistaService;
import com.eebp.accionistas.backend.seguridad.entities.Asset;
import com.eebp.accionistas.backend.seguridad.exceptions.NewUserException;
import com.eebp.accionistas.backend.seguridad.exceptions.UserNotFoundException;
import com.eebp.accionistas.backend.seguridad.utils.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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

    @PostMapping("/actualizarRepresentante")
    public void actualizarRepresentante(@RequestBody ActualizarRepresentanteRequest request) throws UserNotFoundException {
        accionistaService.actualizarRepresentante(request);
    }

    @GetMapping("/accionistaRepresentante/{codUsuario}")
    public Object getAccionistaRepresentante(@PathVariable String codUsuario) throws UserNotFoundException {
        return accionistaService.getAccionistaRepresentante(codUsuario);
    }

    @GetMapping("/{codUsuario}")
    public Accionista getAccionista(@PathVariable String codUsuario) {
        return accionistaService.getAccionista(codUsuario).get();
    }

    @GetMapping("/aprobar/archivos/{codUsuario}")
    public List<Asset> getAprobacionAccionistaFiles(@PathVariable String codUsuario) {
        return FileUploadUtil.files(codUsuario, "raccionista").stream().map(file -> {
            file.setUrl("/assets/images/avatars/" + file.getFileName());
            return file;
        }).collect(Collectors.toList());
    }

    @GetMapping("/aprobar/archivos/eliminar/{fileName}")
    public boolean eliminarArchivo(@PathVariable String fileName) {
        return FileUploadUtil.deleteFile(fileName);
    }


}
