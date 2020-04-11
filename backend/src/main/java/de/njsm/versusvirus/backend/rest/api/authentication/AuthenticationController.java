package de.njsm.versusvirus.backend.rest.api.authentication;

import de.njsm.versusvirus.backend.spring.security.JwtTokenService;
import org.apache.tomcat.util.http.SameSiteCookies;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.time.Duration;

@RestController
@RequestMapping("/api/v1")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService tokenService;
    private final String cookieName;
    private final boolean secureCookie;

    public AuthenticationController(
            AuthenticationManager authenticationManager,
            JwtTokenService tokenService,
            @Value("${jwt.cookie.name}") String cookieName,
            @Value("${jwt.cookie.secure}") boolean secureCookie
    ) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.cookieName = cookieName;
        this.secureCookie = secureCookie;
    }

    @PostMapping("/login")
    public ResponseEntity<Void> authenticate(
            @RequestBody AuthenticationRequest request,
            HttpServletResponse response
    ) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.username, request.password));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        var token = tokenService.generateToken(request.username);
        var authCookie = ResponseCookie.from(cookieName, token)
                .secure(secureCookie)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofHours(12).minusMinutes(1))
                .sameSite(SameSiteCookies.STRICT.getValue())
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookie.toString())
                .build();
    }

}
