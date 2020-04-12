package de.njsm.versusvirus.backend.service.moderator;

import de.njsm.versusvirus.backend.domain.Moderator;

import java.util.UUID;

public class ModeratorDTO {
    public UUID uuid;
    public String name;
    public String email;

    public ModeratorDTO(Moderator moderator) {
        this.uuid = moderator.getUuid();
        this.name = moderator.getName();
        this.email = moderator.getEmail();
    }
}
