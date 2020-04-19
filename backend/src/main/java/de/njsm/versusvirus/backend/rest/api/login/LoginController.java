package de.njsm.versusvirus.backend.rest.api.login;

import de.njsm.versusvirus.backend.spring.security.JwtTokenService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1")
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService tokenService;

    public LoginController(
            AuthenticationManager authenticationManager,
            JwtTokenService tokenService
    ) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<Void> authenticate(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.username, request.password));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok()
                .headers(tokenService.authCookieHeaders(request.username))
                .build();
    }

}
