package com.eebp.accionistas.backend.seguridad.controllers;

import com.eebp.accionistas.backend.seguridad.entities.User;
import com.eebp.accionistas.backend.seguridad.exceptions.NewUserException;
import com.eebp.accionistas.backend.seguridad.exceptions.UserNotFoundException;
import com.eebp.accionistas.backend.seguridad.services.UserServiceImpl;
import com.eebp.accionistas.backend.seguridad.utils.PasswordGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    UserServiceImpl userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    PasswordGenerator passwordGenerator;

    @PostMapping
    public ResponseEntity<User> crearUsuario(@RequestBody User usuario) throws NewUserException {
        String tempPassword = passwordGenerator.generatePassword();
        usuario.setPassword(passwordEncoder.encode(tempPassword));
        return ResponseEntity.ok(userService.crearUsuario(usuario, tempPassword));
    }

    @GetMapping("/{codUsuario}")
    public ResponseEntity<Optional<User>> obtenerUsuario(@PathVariable String codUsuario) throws UserNotFoundException {
        return ResponseEntity.ok(userService.obtenerUsuario(codUsuario));
    }

}
