package com.eebp.accionistas.backend.seguridad.services;

import com.eebp.accionistas.backend.seguridad.dao.JwtAuthenticationResponse;
import com.eebp.accionistas.backend.seguridad.dao.SigninRequest;
import com.eebp.accionistas.backend.seguridad.dao.SigninWithTokenRequest;
import com.eebp.accionistas.backend.seguridad.exceptions.AuthException;

public interface AuthenticationService {
    JwtAuthenticationResponse signIn(SigninRequest request) throws AuthException;

    JwtAuthenticationResponse signInWithToken(SigninWithTokenRequest token);
}
