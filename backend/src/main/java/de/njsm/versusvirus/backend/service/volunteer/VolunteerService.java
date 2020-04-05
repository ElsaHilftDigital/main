package de.njsm.versusvirus.backend.service.volunteer;

import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.domain.common.Address;
import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import de.njsm.versusvirus.backend.repository.OrganizationRepository;
import de.njsm.versusvirus.backend.repository.PurchaseRepository;
import de.njsm.versusvirus.backend.repository.VolunteerRepository;
import de.njsm.versusvirus.backend.service.purchase.PurchaseDTO;
import de.njsm.versusvirus.backend.spring.web.NotFoundException;
import de.njsm.versusvirus.backend.spring.web.TelegramShouldBeFineException;
import de.njsm.versusvirus.backend.telegram.AdminMessageSender;
import de.njsm.versusvirus.backend.telegram.MessageSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class VolunteerService {

    private final VolunteerRepository repository;

    private final MessageSender messageSender;

    private final AdminMessageSender adminMessageSender;

    private final OrganizationRepository organizationRepository;

    private final PurchaseRepository purchaseRepository;

    public VolunteerService(VolunteerRepository repository, MessageSender messageSender, AdminMessageSender adminMessageSender, OrganizationRepository organizationRepository, PurchaseRepository purchaseRepository) {
        this.repository = repository;
        this.messageSender = messageSender;
        this.adminMessageSender = adminMessageSender;
        this.organizationRepository = organizationRepository;
        this.purchaseRepository = purchaseRepository;
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
        notifyModerators();
        return new VolunteerDTO(volunteer);
    }

    private void notifyModerators() {
        var organization = organizationRepository.findById(1).orElseThrow(() -> {
            return new TelegramShouldBeFineException("Organization not found");
        });
        adminMessageSender.newHelperHasRegistered(organization.getTelegramModeratorGroupChatId());
    }

    public List<VolunteerDTO> getVolunteers() {
        return repository.findAll()
                .stream()
                .map(VolunteerDTO::new)
                .collect(Collectors.toList());
    }

    public void updateVolunteer(UUID uuid, UpdateRequest updateRequest) {
        var volunteer = repository.findByUuid(uuid).orElseThrow(NotFoundException::new);

        volunteer.setFirstName(updateRequest.firstName);
        volunteer.setLastName(updateRequest.lastName);
        volunteer.getAddress().setAddress(updateRequest.address);
        volunteer.getAddress().setCity(updateRequest.city);
        volunteer.getAddress().setZipCode(updateRequest.zipCode);
        volunteer.setEmail(updateRequest.email);
        volunteer.setPhone(updateRequest.phone);
        volunteer.setBirthDate(updateRequest.birthDate);
        volunteer.setIban(updateRequest.iban);
        volunteer.setBankName(updateRequest.bankName);
        volunteer.setWantsCompensation(updateRequest.wantsCompensation);
    }

    public void deleteVolunteer(UUID uuid) {
        var volunteer = repository.findByUuid(uuid).orElseThrow(NotFoundException::new);
        volunteer.setDeleted(true);
    }

    public List<PurchaseDTO> getCompletedPurchasesOf(UUID volunteerId) {
        var volunteer = repository.findByUuid(volunteerId).orElseThrow(NotFoundException::new);
        return purchaseRepository.findAllByAssignedVolunteerAndStatus(volunteer.getId(), Purchase.Status.PURCHASE_COMPLETED)
                .stream()
                .map(PurchaseDTO::new)
                .collect(Collectors.toList());
    }

    public List<PurchaseDTO> getOpenPurchasesOf(UUID volunteerId) {
        var volunteer = repository.findByUuid(volunteerId).orElseThrow(NotFoundException::new);
        return purchaseRepository.findAllByAssignedVolunteerAndStatusNot(volunteer.getId(), Purchase.Status.PURCHASE_COMPLETED)
                .stream()
                .map(PurchaseDTO::new)
                .collect(Collectors.toList());
    }

    public void validate(UUID volunteerId) {
        var volunteer = repository.findByUuid(volunteerId).orElseThrow(NotFoundException::new);
        var organization = organizationRepository.findById(1).orElseThrow(NotFoundException::new);

        volunteer.setValidated(true);
        repository.save(volunteer);
        messageSender.confirmRegistration(organization, volunteer);
    }
}
