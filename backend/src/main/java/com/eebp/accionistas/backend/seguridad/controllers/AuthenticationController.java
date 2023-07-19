package com.eebp.accionistas.backend.seguridad.controllers;

import com.eebp.accionistas.backend.seguridad.dao.JwtAuthenticationResponse;
import com.eebp.accionistas.backend.seguridad.dao.SigninRequest;
import com.eebp.accionistas.backend.seguridad.dao.SigninWithTokenRequest;
import com.eebp.accionistas.backend.seguridad.exceptions.AuthException;
import com.eebp.accionistas.backend.seguridad.services.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/sign-in")
    public ResponseEntity<JwtAuthenticationResponse> signIn(@RequestBody SigninRequest request) throws AuthException {
        return ResponseEntity.ok(authenticationService.signIn(request));
    }

    @PostMapping("/sign-in-with-token")
    public ResponseEntity<JwtAuthenticationResponse> signInWithToken(@RequestBody SigninWithTokenRequest request) {
        return ResponseEntity.ok(authenticationService.signInWithToken(request));
    }
}
