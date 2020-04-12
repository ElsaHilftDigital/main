package de.njsm.versusvirus.backend.domain;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class Moderator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private UUID uuid;

    private String name;
    private String email;
    private String login;
    private String password;

    @PrePersist
    private void setUuid() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
    }

    public long getId() {
        return id;
    }

    public UUID getUuid() {
        return uuid;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getLogin() {
        return login;
    }

    public String getPassword() {
        return password;
    }

}
