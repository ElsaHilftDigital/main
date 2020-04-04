package de.njsm.versusvirus.backend.spring.security;

import de.njsm.versusvirus.backend.repository.ModeratorRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class ModeratorUserDetailsService implements UserDetailsService {

    private final ModeratorRepository moderatorRepository;

    public ModeratorUserDetailsService(ModeratorRepository moderatorRepository) {
        this.moderatorRepository = moderatorRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return moderatorRepository.findByLogin(username)
                .map(ModeratorUserDetails::new)
                .orElse(null);
    }
}
