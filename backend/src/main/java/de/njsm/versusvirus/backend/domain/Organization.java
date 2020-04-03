package de.njsm.versusvirus.backend.domain;

@Entity
public class Organization {

    private long id;

    private String name;

    // Bot attributes
    private botToken;
    private updateOffset;
}