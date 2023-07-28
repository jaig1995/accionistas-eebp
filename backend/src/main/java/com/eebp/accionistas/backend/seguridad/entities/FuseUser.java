package com.eebp.accionistas.backend.seguridad.entities;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FuseUser {
    String id;
    String name;
    String email;
    String avatar;
    String status;
    String profile;
}
