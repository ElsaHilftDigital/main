package de.njsm.versusvirus.backend.spring.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.apache.tomcat.util.http.SameSiteCookies;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Stream;

@Service
public class JwtTokenService {

    private static final String COOKIE_NAME = "token";

    private final Key secretKey;
    private final boolean secureCookie;

    public JwtTokenService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.cookie.secure}") boolean secureCookie
    ) {
        if (secret.isBlank()) {
            this.secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        } else {
            this.secretKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
        }
        this.secureCookie = secureCookie;
    }

    public Optional<Authentication> getAuthentication(HttpServletRequest request) {
        var token = getToken(request);
        if (token.isEmpty()) {
            return Optional.empty();
        }
        var username = getUsername(token.get());
        if (username.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(new UsernamePasswordAuthenticationToken(username.get(), token.get(), null));
    }

    private Optional<String> getToken(HttpServletRequest request) {
        var cookies = request.getCookies();
        Stream<Cookie> cookieStream = Objects.nonNull(cookies) ? Arrays.stream(cookies) : Stream.empty();
        return cookieStream.filter(cookie -> COOKIE_NAME.equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue);
    }

    private Optional<String> getUsername(String token) {
        try {
            return Optional.of(Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject());
        } catch (JwtException e) {
            return Optional.empty();
        }
    }

    public ResponseCookie generateAuthCookie(String username) {
        var token = generateToken(username);
        return ResponseCookie.from(COOKIE_NAME, token)
                .secure(secureCookie)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofHours(12).minusMinutes(1))
                .sameSite(SameSiteCookies.STRICT.getValue())
                .build();
    }

    private String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plus(12, ChronoUnit.HOURS)))
                .signWith(secretKey)
                .compact();
    }
}
