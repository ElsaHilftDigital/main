package de.njsm.versusvirus.backend.rest.api.auth;

import de.njsm.versusvirus.backend.service.moderator.ModeratorService;
import de.njsm.versusvirus.backend.spring.security.JwtTokenService;
import de.njsm.versusvirus.backend.spring.web.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/auth")
public class LoginController {

    private static final Logger LOG = LoggerFactory.getLogger(LoginController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService tokenService;
    private final ModeratorService moderatorService;

    public LoginController(
            AuthenticationManager authenticationManager,
            JwtTokenService tokenService,
            ModeratorService moderatorService
    ) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.moderatorService = moderatorService;
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

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody ChangePasswordRequest request,
                               Principal principal) {
        if (principal == null) {
            LOG.error("Unauthenticated user was able to access change-password endpoint");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(principal.getName(), request.oldPassword));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (request.newPassword.length() < 8) {
            throw new BadRequestException();
        }

        moderatorService.changePassword(principal.getName(), request.newPassword);
        return ResponseEntity.ok().build();
    }
}
