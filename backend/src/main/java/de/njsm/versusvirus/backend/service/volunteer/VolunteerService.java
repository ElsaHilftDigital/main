package de.njsm.versusvirus.backend.service.volunteer;

import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.domain.common.Address;
import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import de.njsm.versusvirus.backend.events.EventStore;
import de.njsm.versusvirus.backend.events.Notifications;
import de.njsm.versusvirus.backend.mail.OurMailSender;
import de.njsm.versusvirus.backend.repository.OrganizationRepository;
import de.njsm.versusvirus.backend.repository.PurchaseRepository;
import de.njsm.versusvirus.backend.repository.VolunteerRepository;
import de.njsm.versusvirus.backend.service.purchase.PurchaseDTO;
import de.njsm.versusvirus.backend.spring.web.InternalServerErrorException;
import de.njsm.versusvirus.backend.spring.web.NotFoundException;
import de.njsm.versusvirus.backend.telegram.AdminMessageSender;
import de.njsm.versusvirus.backend.telegram.InviteLinkGenerator;
import de.njsm.versusvirus.backend.telegram.MessageSender;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.StringReader;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class VolunteerService {

    private final VolunteerRepository repository;
    private final MessageSender messageSender;
    private final AdminMessageSender adminMessageSender;
    private final EventStore eventStore;
    private final OrganizationRepository organizationRepository;
    private final PurchaseRepository purchaseRepository;
    private final InviteLinkGenerator inviteLinkGenerator;
    private final OurMailSender mailSender;
    private final long moderatorChatId;

    public VolunteerService(VolunteerRepository repository,
                            MessageSender messageSender,
                            AdminMessageSender adminMessageSender,
                            EventStore eventStore,
                            OrganizationRepository organizationRepository,
                            PurchaseRepository purchaseRepository,
                            InviteLinkGenerator inviteLinkGenerator,
                            OurMailSender mailSender,
                            @Value("${telegram.groupchat.id}") long moderatorChatId) {
        this.repository = repository;
        this.messageSender = messageSender;
        this.adminMessageSender = adminMessageSender;
        this.eventStore = eventStore;
        this.organizationRepository = organizationRepository;
        this.purchaseRepository = purchaseRepository;
        this.inviteLinkGenerator = inviteLinkGenerator;
        this.mailSender = mailSender;
        this.moderatorChatId = moderatorChatId;
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

        String inviteLink = inviteLinkGenerator.getInviteLink(volunteer.getUuid());
        notifyModerators();
        mailSender.sendRegistrationMail(volunteer, inviteLink);
        return new VolunteerDTO(volunteer, inviteLink);
    }

    public void sendInvitationEmail(UUID volunteerId) {
        var volunteer = repository.findByUuid(volunteerId).orElseThrow(NotFoundException::new);
        String inviteLink = inviteLinkGenerator.getInviteLink(volunteer.getUuid());
        mailSender.sendRegistrationMail(volunteer, inviteLink);
    }

    private void notifyModerators() {
        eventStore.publish(Notifications.volunteerRegistered());
        adminMessageSender.newHelperHasRegistered();
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
        if (!updateRequest.iban.equals("")) volunteer.setIban(updateRequest.iban);
        if (!updateRequest.bankName.equals("")) volunteer.setBankName(updateRequest.bankName);
        volunteer.setWantsCompensation(updateRequest.wantsCompensation);
    }

    public void deleteVolunteer(UUID uuid) {
        var volunteer = repository.findByUuid(uuid).orElseThrow(NotFoundException::new);
        volunteer.delete();
    }

    public List<PurchaseDTO> getCompletedPurchasesOf(UUID volunteerId) {
        var volunteer = repository.findByUuid(volunteerId).orElseThrow(NotFoundException::new);
        return purchaseRepository.findAllByAssignedVolunteerAndStatusAndDeletedFalse(volunteer.getId(), Purchase.Status.PURCHASE_COMPLETED)
                .stream()
                .map(PurchaseDTO::new)
                .collect(Collectors.toList());
    }

    public List<PurchaseDTO> getOpenPurchasesOf(UUID volunteerId) {
        var volunteer = repository.findByUuid(volunteerId).orElseThrow(NotFoundException::new);
        return purchaseRepository.findAllByAssignedVolunteerAndStatusNotAndDeletedFalse(volunteer.getId(), Purchase.Status.PURCHASE_COMPLETED)
                .stream()
                .map(PurchaseDTO::new)
                .collect(Collectors.toList());
    }

    public void validate(UUID volunteerId) {
        var volunteer = repository.findByUuid(volunteerId).orElseThrow(NotFoundException::new);

        volunteer.setValidated(true);
        messageSender.confirmRegistration(volunteer);
    }

    public void importVolunteers(String upload) {
        Iterable<CSVRecord> records;
        var format = DateTimeFormatter.ofPattern("yyyy-MM-dd").withLocale(Locale.GERMAN).withZone(ZoneId.of("Europe/Zurich"));
        try {
            records = CSVFormat.DEFAULT.withHeader().parse(new StringReader(upload));
        } catch (IOException e) {
            throw new InternalServerErrorException(e);
        }
        for (CSVRecord record : records) {
            SignupRequest req = new SignupRequest();
            req.firstName = record.get("Vorname");
            req.lastName = record.get("Name");
            req.phone = record.get("Telefonnummer");
            req.email = record.get("Email");
            req.address = record.get("Adresse");
            req.city = record.get("Wohnort");
            req.zipCode = record.get("PLZ");
            req.birthDate = LocalDate.parse(record.get("Geb.Dat."), format);
            req.iban = record.get("IBAN");
            req.bankName = record.get("Bankname");
            req.wantsCompensation = record.get("Entschädigung").equals("1");
            signup(req);
        }
    }
}
