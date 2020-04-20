package de.njsm.versusvirus.backend.domain.common;

import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;

@Embeddable
public class Address {
    @NotNull private String address;
    @NotNull private String City;
    @NotNull private String zipCode;

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return City;
    }

    public void setCity(String city) {
        City = city;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
}
