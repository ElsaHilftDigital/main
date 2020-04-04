package de.njsm.versusvirus.backend.rest.api.login;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Optional;


@RestController
@RequestMapping("/api/v1/login")
public class LoginController {

    @RequestMapping()
    public LoginInfoDTO loginState(Principal principal) {
        return Optional.ofNullable(principal).map(LoginInfoDTO::new).orElse(null);
    }
}
