package de.njsm.versusvirus.backend.spring.security;

import de.njsm.versusvirus.backend.domain.Moderator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class ModeratorUserDetails implements UserDetails {

    private final Moderator moderator;

    public ModeratorUserDetails(Moderator moderator) {
        this.moderator = moderator;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("user")
        );
    }

    @Override
    public String getPassword() {
        return moderator.getPassword();
    }

    @Override
    public String getUsername() {
        return moderator.getLogin();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
