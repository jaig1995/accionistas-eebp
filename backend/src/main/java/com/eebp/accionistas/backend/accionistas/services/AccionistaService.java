package com.eebp.accionistas.backend.accionistas.services;

import com.eebp.accionistas.backend.accionistas.entities.Accionista;
import com.eebp.accionistas.backend.accionistas.entities.Persona;
import com.eebp.accionistas.backend.accionistas.entities.request.AprobarAccionistaRequest;
import com.eebp.accionistas.backend.accionistas.repositories.AccionistaRepository;
import com.eebp.accionistas.backend.seguridad.entities.EmailDetails;
import com.eebp.accionistas.backend.seguridad.entities.User;
import com.eebp.accionistas.backend.seguridad.exceptions.NewUserException;
import com.eebp.accionistas.backend.seguridad.services.EmailServiceImpl;
import com.eebp.accionistas.backend.seguridad.services.UserService;
import com.eebp.accionistas.backend.seguridad.services.UserServiceImpl;
import com.eebp.accionistas.backend.seguridad.utils.PasswordGenerator;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class AccionistaService {

    @Autowired
    private AccionistaRepository accionistaRepository;

    @Autowired
    private PersonaService personaService;

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private EmailServiceImpl emailService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    PasswordGenerator passwordGenerator;

    public Accionista addAccionista(Accionista accionista) {
        accionista.setAprobado("N");
        accionista.setTipoAccionista(1);
        Persona persona = personaService.getPersona(accionista.getCodUsuario()).get();
        emailService.sendSimpleMail(
                EmailDetails.builder()
                        .recipient(persona.getCorreoPersona())
                        .subject("Registro como accionista de EEBP")
                        .msgBody("<table border=\"0\" cellspacing=\"0\" style=\"border-collapse:collapse; height:147px; width:600px\">\n" +
                                "\t<tbody>\n" +
                                "\t\t<tr>\n" +
                                "\t\t\t<td style=\"height:91px; text-align:center; width:23.5796%\"><img src=\"https://eebpsa.com.co/wp-content/uploads/2020/08/lOGO-2.1.png\" /></td>\n" +
                                "\t\t\t<td style=\"height:91px; width:67.4766%\">\n" +
                                "\t\t\t<h3 style=\"text-align:center\"><strong>BIENVENIDO AL SISTEMA DE ACCIONISTAS </strong></h3>\n" +
                                "\n" +
                                "\t\t\t<h3 style=\"text-align:center\"><strong>Empresa de Energ&iacute;a del Bajo Putumayo S.A. E.S.P.</strong></h3>\n" +
                                "\t\t\t</td>\n" +
                                "\t\t</tr>\n" +
                                "\t\t<tr>\n" +
                                "\t\t\t<td colspan=\"2\" style=\"height:10px; text-align:center; width:91.0562%\">\n" +
                                "\t\t\t<p>&nbsp;</p>\n" +
                                "\n" +
                                "\t\t\t<p style=\"text-align:left\">Se&ntilde;or(a) " + persona.getNomPri() + " " + persona.getNomSeg() + " " + persona.getApePri() +  " " + persona.getApeSeg()  + ",</p>\n" +
                                "\n" +
                                "\t\t\t<p style=\"text-align:left\">Su registro como accionista ha sido exitoso y se encuentra en estado de REVISI&Oacute;N, una vez sea aprobado, se le notificar&aacute; por &eacute;ste mismo medio.</p>\n" +
                                "\t\t\t</td>\n" +
                                "\t\t</tr>\n" +
                                "\t\t<tr>\n" +
                                "\t\t\t<td colspan=\"2\" style=\"text-align:center; width:91.0562%\">\n" +
                                "\t\t\t<p style=\"text-align:left\">&nbsp;</p>\n" +
                                "\n" +
                                "\t\t\t<p style=\"text-align:left\"><u>En caso de alguna duda, favor contactarse con servicio al cliente.</u></p>\n" +
                                "\n" +
                                "\t\t\t<p style=\"text-align:left\">&nbsp;</p>\n" +
                                "\n" +
                                "\t\t\t<p style=\"text-align:left\">Acceso al sistema: <a href=\"http://localhost:4200\">http://localhost:4200</a></p>\n" +
                                "\t\t\t</td>\n" +
                                "\t\t</tr>\n" +
                                "\t</tbody>\n" +
                                "</table>\n" +
                                "\n" +
                                "<p><strong>&nbsp;</strong></p>")
                        .build()
        );
        log.info("Accionista registrado correctamente.");
        return accionistaRepository.save(accionista);
    }

    public void aprobarAccionista(AprobarAccionistaRequest aprobarAccionistaRequest) throws NewUserException {
        accionistaRepository.aprobarAccionista(aprobarAccionistaRequest.getCodUsuario());
        Persona persona = personaService.getPersona(aprobarAccionistaRequest.getCodUsuario()).get();
        emailService.sendSimpleMail(
                EmailDetails.builder()
                        .recipient(persona.getCorreoPersona())
                        .subject("Registro como accionista de EEBP")
                        .msgBody("<table border=\"0\" cellspacing=\"0\" style=\"border-collapse:collapse; height:147px; width:600px\">\n" +
                                "\t<tbody>\n" +
                                "\t\t<tr>\n" +
                                "\t\t\t<td style=\"height:91px; text-align:center; width:23.5796%\"><img src=\"https://eebpsa.com.co/wp-content/uploads/2020/08/lOGO-2.1.png\" /></td>\n" +
                                "\t\t\t<td style=\"height:91px; width:67.4766%\">\n" +
                                "\t\t\t<h3 style=\"text-align:center\"><strong>BIENVENIDO AL SISTEMA DE ACCIONISTAS </strong></h3>\n" +
                                "\n" +
                                "\t\t\t<h3 style=\"text-align:center\"><strong>Empresa de Energ&iacute;a del Bajo Putumayo S.A. E.S.P.</strong></h3>\n" +
                                "\t\t\t</td>\n" +
                                "\t\t</tr>\n" +
                                "\t\t<tr>\n" +
                                "\t\t\t<td colspan=\"2\" style=\"height:10px; text-align:center; width:91.0562%\">\n" +
                                "\t\t\t<p>&nbsp;</p>\n" +
                                "\n" +
                                "\t\t\t<p style=\"text-align:left\">Se&ntilde;or(a) " + persona.getNomPri() + " " + persona.getNomSeg() + " " + persona.getApePri() +  " " + persona.getApeSeg()  + ",</p>\n" +
                                "\n" +
                                "\t\t\t<p style=\"text-align:left\">Su registro como accionista ha sido APROBADO, en instantes recibirá un correo electrónico con las credenciales de inicio de sesión.</p>\n" +
                                "\t\t\t</td>\n" +
                                "\t\t</tr>\n" +
                                "\t\t<tr>\n" +
                                "\t\t\t<td colspan=\"2\" style=\"text-align:center; width:91.0562%\">\n" +
                                "\t\t\t<p style=\"text-align:left\">&nbsp;</p>\n" +
                                "\n" +
                                "\t\t\t<p style=\"text-align:left\"><u>En caso de alguna duda, favor contactarse con servicio al cliente.</u></p>\n" +
                                "\n" +
                                "\t\t\t<p style=\"text-align:left\">&nbsp;</p>\n" +
                                "\n" +
                                "\t\t\t<p style=\"text-align:left\">Acceso al sistema: <a href=\"http://localhost:4200\">http://localhost:4200</a></p>\n" +
                                "\t\t\t</td>\n" +
                                "\t\t</tr>\n" +
                                "\t</tbody>\n" +
                                "</table>\n" +
                                "\n" +
                                "<p><strong>&nbsp;</strong></p>")
                        .build()
        );
        String tempPassword = passwordGenerator.generatePassword();

        userService.crearUsuario(User.builder()
                .codUsuario(persona.getCodUsuario())
                .nombreUsuario(persona.getNomPri() + " " + persona.getNomSeg())
                .apellidoUsuario(persona.getApePri() +  " " + persona.getApeSeg())
                .email(persona.getCorreoPersona())
                .perfil(2).password(passwordEncoder.encode(tempPassword)).build(), tempPassword);
        log.info("Accionista aprobado correctamente");
    }
}
