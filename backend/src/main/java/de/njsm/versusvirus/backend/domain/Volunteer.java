package de.njsm.versusvirus.backend.domain;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String surname;
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
