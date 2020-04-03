package de.njsm.versusvirus.backend.service.volunteer;

import de.njsm.versusvirus.backend.domain.common.Address;
import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import de.njsm.versusvirus.backend.repository.VolunteerRepository;
import de.njsm.versusvirus.backend.rest.api.anonymous.SignupRequest;
import de.njsm.versusvirus.backend.rest.api.anonymous.VolunteerDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class VolunteerService {

    private final VolunteerRepository repository;

    public VolunteerService(VolunteerRepository repository) {
        this.repository = repository;
    }

    public Optional<VolunteerDTO> getVolunteer(UUID uuid) {
        return repository.findByUuid(uuid).map(VolunteerDTO::new);
    }

    public VolunteerDTO signup(SignupRequest signupRequest) {
        var volunteer = new Volunteer();
        var address = new Address();
        address.setAddress(signupRequest.address);
        address.setCity(signupRequest.city);
        address.setZipCode(signupRequest.zipCode);

        volunteer.setFirstName(signupRequest.firstName);
        volunteer.setLastName(signupRequest.lastName);
        volunteer.setEmail(signupRequest.email);
        volunteer.setPhone(signupRequest.phone);
        volunteer.setAddress(address);
        volunteer.setBirthDate(signupRequest.birthDate);
        volunteer.setIban(signupRequest.iban);
        volunteer.setBankName(signupRequest.bankName);
        volunteer.setWantsCompensation(signupRequest.wantsCompensation);

        repository.save(volunteer);
        return new VolunteerDTO(volunteer);
    }

}
