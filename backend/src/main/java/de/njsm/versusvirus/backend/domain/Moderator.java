package de.njsm.versusvirus.backend.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Moderator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    public String getLogin() {
        return login;
    }

    public String getPassword() {
        return password;
    }

    private String name;
    private String email;
    private String login;
    private String password;

    public long getId() {
        return id;
    }
}
