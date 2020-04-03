package de.njsm.versusvirus.backend.domain;

import de.njsm.versusvirus.backend.domain.common.Address;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private UUID uuid;

    private String firstName;
    private String lastName;
    private String phone;
    private String mobile;
    private Address address;

}
