package de.njsm.versusvirus.backend.rest.api.login;

import java.security.Principal;

public class LoginInfoDTO {
    public String username;

    public LoginInfoDTO(Principal principal) {
        this.username = principal.getName();
    }
}
