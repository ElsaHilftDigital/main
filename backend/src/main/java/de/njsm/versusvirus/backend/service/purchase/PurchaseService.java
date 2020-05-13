package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.*;
import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import de.njsm.versusvirus.backend.repository.*;
import de.njsm.versusvirus.backend.service.volunteer.VolunteerDTO;
import de.njsm.versusvirus.backend.spring.web.BadRequestException;
import de.njsm.versusvirus.backend.spring.web.NotFoundException;
import de.njsm.versusvirus.backend.telegram.MessageSender;
import de.njsm.versusvirus.backend.telegram.TelegramApi;
import io.prometheus.client.Gauge;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.Principal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static de.njsm.versusvirus.backend.domain.Purchase.Status.*;

@Service
@Transactional
public class PurchaseService {

    private static final Logger LOG = LoggerFactory.getLogger(PurchaseService.class);

    private final PurchaseRepository purchaseRepository;

    private final PurchaseSupermarketRepository purchaseSupermarketRepository;

    private final OrderItemRepository orderItemRepository;

    private final OrganizationRepository organizationRepository;

    private final CustomerRepository customerRepository;

    private final VolunteerRepository volunteerRepository;

    private final ModeratorRepository moderatorRepository;

    private final MessageSender messageSender;

    private final long groupChatId;

    private final TelegramApi telegramApi;

    private static final Gauge PURCHASES = Gauge.build()
            .name("elsa_hilft_purchases")
            .labelNames("state")
            .help("Number of purchases by state")
            .register();

    private final String[] EXPORT_CSV_HEADER = {"Auftrag #", "Auftrag Status", "Auftrag Datum", "Auftrag Zahlungsmethode", "Auftrag Kosten", "Helfer Name", "Helfer Vorname", "Helfer Adresse", "Helfer PLZ", " Helfer Wohnort", "Helfer Geb.Dat.", "Helfer IBAN", "Helfer Bank", "Helfer Entschädigung", "Kunde Name", "Kunde Vorname", "Kunde Adresse", "Kunde PLZ", "Kunde Wohnort"};

    public PurchaseService(PurchaseRepository purchaseRepository,
                           PurchaseSupermarketRepository purchaseSupermarketRepository,
                           OrderItemRepository orderItemRepository,
                           OrganizationRepository organizationRepository,
                           CustomerRepository customerRepository,
                           VolunteerRepository volunteerRepository,
                           ModeratorRepository moderatorRepository,
                           MessageSender messageSender,
                           TelegramApi telegramApi,
                           @Value("${telegram.groupchat.id}") long groupChatId) {
        this.purchaseRepository = purchaseRepository;
        this.purchaseSupermarketRepository = purchaseSupermarketRepository;
        this.orderItemRepository = orderItemRepository;
        this.organizationRepository = organizationRepository;
        this.customerRepository = customerRepository;
        this.volunteerRepository = volunteerRepository;
        this.moderatorRepository = moderatorRepository;
        this.messageSender = messageSender;
        this.telegramApi = telegramApi;
        this.groupChatId = groupChatId;
    }

    public UUID create(Principal principal, CreatePurchaseRequest req) {
        Purchase purchase = createPurchase(principal, req);
        return purchase.getUuid();
    }

    private Purchase createPurchase(Principal principal, CreatePurchaseRequest req) {
        var purchase = new Purchase();
        var moderator = moderatorRepository.findByLogin(principal.getName()).orElseThrow(NotFoundException::new);
        var customer = customerRepository.findByUuid(req.customer).orElseThrow(NotFoundException::new);

        for (PurchaseSupermarketDTO market : req.supermarkets) {
            var persistentMarket = new PurchaseSupermarket();
            persistentMarket.setName(market.name);
            for (String orderItemName : market.orderItems) {
                var orderItem = new OrderItem();
                orderItem.setPurchaseItem(orderItemName);
                orderItem.setPurchaseSupermarket(persistentMarket);
                persistentMarket.addOrderItem(orderItem);
            }
            persistentMarket.setPurchase(purchase);
            purchase.addSupermarket(persistentMarket);
        }

        purchase.setPaymentMethod(req.paymentMethod);
        purchase.setTiming(req.timing);

        purchase.setPurchaseSize(req.purchaseSize);
        purchase.setPublicComments(req.publicComments);
        purchase.setPrivateComments(req.privateComments);
        purchase.setCreatedByModerator(moderator.getId());
        purchase.setCustomerId(customer.getId());
        purchase.setStatus(NEW);
        purchase.setCreateTime();
        var executionTime = Instant.from(DateTimeFormatter.ISO_INSTANT.parse(req.executionDate));
        purchase.setExecutionTime(executionTime);
        purchase.setPurchaseNumber(purchaseRepository.generatePurchaseNumber(executionTime));

        // responsible is creator by default
        purchase.setResponsibleModeratorId(moderator.getId());

        purchaseRepository.save(purchase);
        return purchase;
    }

    public void publishPurchase(UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        var customer = customerRepository.findById(purchase.getCustomerId()).orElseThrow(NotFoundException::new);
        messageSender.broadcastPurchase(customer, purchase);
    }

    public void withdrawPurchase(UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        if (purchase.getAssignedVolunteer().isPresent() || !purchase.getVolunteerApplications().isEmpty()) {
            throw new IllegalStateException("Cannot withdraw purchase after volunteers have applied");
        }
        if (purchase.getStatus() == PUBLISHED) {
            telegramApi.deleteMessage(groupChatId, purchase.getBroadcastMessageId());
            purchase.setStatus(NEW);
        }
    }

    public List<PurchaseListItemDTO> getPurchases() {
        var purchases = purchaseRepository.findByDeletedFalse();
        var customers = customerRepository.findAllById(purchases.stream().map(Purchase::getCustomerId).collect(Collectors.toSet()))
                .stream().collect(Collectors.toMap(Customer::getId, Function.identity()));
        var volunteers = volunteerRepository.findAllById(
                purchases.stream()
                        .map(Purchase::getAssignedVolunteer)
                        .flatMap(Optional::stream)
                        .collect(Collectors.toSet()))
                .stream()
                .collect(Collectors.toMap(Volunteer::getId, Function.identity()));
        var moderators = moderatorRepository.findAllById(
                Stream.concat(
                        purchases.stream().map(Purchase::getCreatedByModerator),
                        purchases.stream().map(Purchase::getResponsibleModeratorId))
                        .collect(Collectors.toSet()))
                .stream()
                .collect(Collectors.toMap(Moderator::getId, Function.identity()));
        return purchases.stream()
                .map(purchase -> new PurchaseListItemDTO(
                        purchase,
                        customers.get(purchase.getCustomerId()),
                        purchase.getAssignedVolunteer().map(volunteers::get).orElse(null),
                        moderators.get(purchase.getResponsibleModeratorId()),
                        moderators.get(purchase.getCreatedByModerator())))
                .collect(Collectors.toList());
    }

    public void deletePurchase(UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        if (purchase.getAssignedVolunteer().isPresent()) {
            throw new IllegalStateException("Cannot delete purchase after volunteer is assigned");
        }

        purchase.setDeleted(true);
        if (purchase.getStatus() == PUBLISHED ||
                purchase.getStatus() == VOLUNTEER_FOUND) {

            telegramApi.deleteMessage(groupChatId, purchase.getBroadcastMessageId());
            // The following entity is loaded from a not-null foreign key, it should never fail
            //noinspection OptionalGetWithoutIsPresent
            var customer = customerRepository.findById(purchase.getCustomerId()).get();
            messageSender.rejectApplicants(customer, purchase, volunteerRepository.findAllById(purchase.getVolunteerApplications()));
        }
    }

    public FetchedPurchaseDTO getFetchedPurchase(UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        var assignedVolunteer = purchase.getAssignedVolunteer().flatMap(volunteerRepository::findById).orElse(null);
        var volunteerApplications = volunteerRepository.findAllById(purchase.getVolunteerApplications());

        // The following entities are loaded from not-null foreign keys, they should never fail
        //noinspection OptionalGetWithoutIsPresent
        var customer = customerRepository.findById(purchase.getCustomerId()).get();
        //noinspection OptionalGetWithoutIsPresent
        var createdBy = moderatorRepository.findById(purchase.getCreatedByModerator()).get();
        //noinspection OptionalGetWithoutIsPresent
        var responsible = moderatorRepository.findById(purchase.getResponsibleModeratorId()).get();

        return new FetchedPurchaseDTO(purchase, assignedVolunteer, volunteerApplications, customer, createdBy, responsible);
    }

    public void assignVolunteer(UUID purchaseId, UUID volunteerId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        var volunteer = volunteerRepository.findByUuid(volunteerId).orElseThrow(NotFoundException::new);
        var customer = customerRepository.findById(purchase.getCustomerId()).orElseThrow(NotFoundException::new);

        if (!purchase.getVolunteerApplications().contains(volunteer.getId())) {
            LOG.error("Assigned volunteer who didn't volunteer");
            return;
        }

        if (purchase.getStatus() != VOLUNTEER_FOUND) {
            LOG.error("This purchase is in the unexpected state " + purchase.getStatus().name());
            return;
        }

        purchase.setAssignedVolunteer(volunteer.getId());

        messageSender.offerPurchase(purchase, customer, volunteer);
    }

    public void updatePurchase(UUID purchaseId, UpdatePurchaseRequest updateRequest) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        purchase.setPublicComments(updateRequest.publicComments);
        purchase.setPrivateComments(updateRequest.privateComments);
        purchase.setInternalComments(updateRequest.internalComments);
        purchase.setPurchaseSize(updateRequest.size);
        purchase.setPaymentMethod(updateRequest.paymentMethod);
        purchase.setTiming(updateRequest.timing);
        purchase.setCost(updateRequest.cost);
        var newExecutionDate = Instant.from(DateTimeFormatter.ISO_INSTANT.parse(updateRequest.executionDate));

        if (!newExecutionDate.atZone(ZoneId.of("Europe/Zurich")).equals(purchase.getExecutionTime().atZone(ZoneId.of("Europe/Zurich")))) {
            purchase.setPurchaseNumber(purchaseRepository.generatePurchaseNumber(newExecutionDate));
        }
        purchase.setExecutionTime(newExecutionDate);

        if (List.of(NEW, PUBLISHED, VOLUNTEER_FOUND).contains(purchase.getStatus())) {
            purchase.getPurchaseSupermarketList().clear();
            for (PurchaseSupermarketDTO market : updateRequest.supermarkets) {
                var persistentMarket = new PurchaseSupermarket();
                persistentMarket.setName(market.name);
                for (String orderItemName : market.orderItems) {
                    var orderItem = new OrderItem();
                    orderItem.setPurchaseItem(orderItemName);
                    persistentMarket.addOrderItem(orderItem);
                }
                persistentMarket.setPurchase(purchase);
                purchase.addSupermarket(persistentMarket);
            }
        }

        var moderator = moderatorRepository.findByUuid(updateRequest.responsibleModerator).orElseThrow(BadRequestException::new);
        purchase.setResponsibleModeratorId(moderator.getId());
    }

    public void customerNotified(UUID purchaseId, String messageToVolunteer) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        var volunteer = purchase.getAssignedVolunteer().flatMap(volunteerRepository::findById).orElseThrow(NotFoundException::new);
        var customer = customerRepository.findById(purchase.getCustomerId()).orElseThrow(NotFoundException::new);

        if (purchase.getStatus() == Purchase.Status.PURCHASE_DONE) {

            purchase.setStatus(Purchase.Status.CUSTOMER_NOTIFIED);
            messageSender.informToDeliverPurchase(purchase, volunteer, customer, messageToVolunteer);
        } else {
            LOG.warn("purchase is in wrong state {} to instruct helper for delivery", purchase.getStatus());
        }
    }

    public void markCompleted(UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        purchase.setStatus(Purchase.Status.PURCHASE_COMPLETED);
    }

    public List<VolunteerDTO> getAvailableVolunteers(UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        return volunteerRepository.findAllById(purchase.getVolunteerApplications())
                .stream()
                .map(VolunteerDTO::new)
                .collect(Collectors.toList());
    }

    public ReceiptDTO getReceipt(UUID supermarketId) {
        var supermarket = purchaseSupermarketRepository.findByUuid(supermarketId).orElseThrow(NotFoundException::new);
        return new ReceiptDTO(supermarket);
    }

    public void export(PrintWriter writer, UUID purchaseId) throws IOException {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        var customer = customerRepository.findById(purchase.getCustomerId());
        var volunteer = purchase.getAssignedVolunteer().flatMap(volunteerRepository::findById);
        CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.EXCEL.withDelimiter(';')
                                    .withHeader(EXPORT_CSV_HEADER));
        purchase.writeToCsv(csvPrinter, customer, volunteer);
    }

    public void exportAll(PrintWriter writer, LocalDate startDate, LocalDate endDate) throws IOException {
        List<Purchase> allPurchases = purchaseRepository.findByDeletedFalse(Sort.by("executionTime"));

        CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.EXCEL.withDelimiter(';')
                                    .withHeader(EXPORT_CSV_HEADER));

        for(Purchase purchase : allPurchases) {
            LocalDate executionDate = LocalDate.ofInstant(purchase.getExecutionTime(), ZoneId.of("Europe/Zurich"));
            if (executionDate.isBefore(startDate)) {
                continue;
            }
            if (executionDate.isAfter(endDate)) {
                break;
            }
            var customer = customerRepository.findById(purchase.getCustomerId());
            var volunteer = purchase.getAssignedVolunteer().flatMap(volunteerRepository::findById);
            purchase.writeToCsv(csvPrinter, customer, volunteer);
        }
    }

    public void updateSummary() {
        for (Purchase.Status s : Purchase.Status.values()) {
            PURCHASES.labels(s.name()).set(0);
        }
        List<PurchaseRepository.PurchaseSummary> summaries = purchaseRepository.summarizeByState();
        summaries.forEach(s -> PURCHASES.labels(s.getStatus().name()).set(s.getNumberOfPurchases()));
    }
}
