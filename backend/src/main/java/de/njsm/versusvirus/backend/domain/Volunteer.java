package de.njsm.versusvirus.backend.domain;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private UUID uuid;

    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private Address address;
    private LocalDate birthDate;
    private String iban;
}

@Embeddable
class Address {
    private String address;
    private String City;
    private String zipCode;
}
