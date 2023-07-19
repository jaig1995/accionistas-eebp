package com.eebp.accionistas.backend.seguridad.services;

import com.eebp.accionistas.backend.seguridad.dao.JwtAuthenticationResponse;
import com.eebp.accionistas.backend.seguridad.dao.SigninRequest;
import com.eebp.accionistas.backend.seguridad.dao.SigninWithTokenRequest;
import com.eebp.accionistas.backend.seguridad.entities.FuseUser;
import com.eebp.accionistas.backend.seguridad.exceptions.AuthException;
import com.eebp.accionistas.backend.seguridad.repositories.UserRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Log4j2
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public JwtAuthenticationResponse signIn(SigninRequest request) throws AuthException {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getCodUsuario(), request.getPassword()));
            log.info("Usuario " + request.getCodUsuario() + " inicio sesion correctamente.");
        } catch (Exception e) {
            log.info("Credenciales no validas para iniciar sesion. Usuario: " + request.getCodUsuario());
            throw new AuthException();
        }



        var user = userRepository.findByCodUsuario(request.getCodUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        var jwt = jwtService.generateToken(user);
        FuseUser fuseUser = FuseUser.builder()
                .id(user.getCodUsuario())
                .profile("ADMIN")
                .name(user.getNombreUsuario() + " " + user.getApellidoUsuario())
                .avatar("assets/images/avatars/" + user.getCodUsuario() + ".jpg")
                .email(user.getEmail())
                .status("Online").build();
        return JwtAuthenticationResponse.builder().accessToken(jwt).user(fuseUser).build();
    }

    @Override
    public JwtAuthenticationResponse signInWithToken(SigninWithTokenRequest request) {
        String codigoUsuario = jwtService.extractUserName(request.getAccessToken());
        var user = userRepository.findByCodUsuario(codigoUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Invalid operation"));
        var jwt = jwtService.generateToken(user);
        FuseUser fuseUser = FuseUser.builder()
                .id(user.getCodUsuario())
                .profile("ADMIN")
                .name(user.getNombreUsuario() + " " + user.getApellidoUsuario())
                .avatar("assets/images/avatars/" + user.getCodUsuario() + ".jpg")
                .email(user.getEmail())
                .status("Online").build();
        return JwtAuthenticationResponse.builder().accessToken(jwt).user(fuseUser).build();
    }
}
