package de.njsm.versusvirus.backend.domain.common;

import org.springframework.lang.Nullable;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;
import java.util.Optional;

@Embeddable
public class Address {
    @NotNull private String address;
    @NotNull private String City;
    @Nullable private String zipCode;

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

    public Optional<String> getZipCode() {
        return Optional.ofNullable(zipCode);
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
}
