package com.eebp.accionistas.backend.seguridad.services;

import com.eebp.accionistas.backend.seguridad.entities.EmailDetails;
import com.eebp.accionistas.backend.seguridad.entities.User;
import com.eebp.accionistas.backend.seguridad.entities.UsuarioPerfil;
import com.eebp.accionistas.backend.seguridad.exceptions.NewUserException;
import com.eebp.accionistas.backend.seguridad.exceptions.UserExistsException;
import com.eebp.accionistas.backend.seguridad.exceptions.UserNotFoundException;
import com.eebp.accionistas.backend.seguridad.repositories.UserRepository;
import com.eebp.accionistas.backend.seguridad.repositories.UsuarioPerfilRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    private UsuarioPerfilRepository usuarioPerfilRepository;

    @Autowired
    private EmailServiceImpl emailService;

    @Override
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) {
                return userRepository.findByCodUsuario(username)
                        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
            }
        };
    }

    public User crearUsuario(User user, String tempPassword) throws NewUserException {
        try {
            if (userRepository.findByCodUsuario(user.getCodUsuario()).isEmpty()) {
                User response = userRepository.save(user);
                usuarioPerfilRepository.save(
                        UsuarioPerfil.builder()
                                .codUsuario(user.getCodUsuario())
                                .codPerfil(user.getPerfil())
                                .build()
                );
                log.info("Usuario " + user.getCodUsuario() + " creado exitosamente");
                emailService.sendSimpleMail(
                        EmailDetails.builder()
                                .recipient(user.getEmail())
                                .subject("Registro exitoso en el sistema de accionistas EEBP")
                                .msgBody("Su clave temporal es: " + tempPassword)
                                .build()
                );
                log.info("Email enviado con clave temporal al usuario " + user.getCodUsuario());
                return response;
            } else {
                log.info("El usuario con identificación " + user.getCodUsuario() + " ya existe en la base de datos.");
                throw new UserExistsException();
            }

        } catch (Exception e) {
            log.info("Error al crear el usuario " + user.getCodUsuario() + ". " + e.getMessage());
            throw new NewUserException();
        }

    }

    public Optional<User> obtenerUsuario(String codUsuario) throws UserNotFoundException {
        Optional<User> response = userRepository.findByCodUsuario(codUsuario);
        if (!response.isEmpty()) {
            return response;
        } else {
            log.info("Usuario no encontrado: " + codUsuario);
            throw new UserNotFoundException();
        }
    }
}
