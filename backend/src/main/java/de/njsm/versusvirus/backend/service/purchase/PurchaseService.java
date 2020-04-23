package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.*;
import de.njsm.versusvirus.backend.domain.volunteer.Volunteer;
import de.njsm.versusvirus.backend.repository.*;
import de.njsm.versusvirus.backend.service.volunteer.VolunteerDTO;
import de.njsm.versusvirus.backend.spring.web.BadRequestException;
import de.njsm.versusvirus.backend.spring.web.NotFoundException;
import de.njsm.versusvirus.backend.telegram.MessageSender;
import io.prometheus.client.Gauge;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.Principal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
public class PurchaseService {

    private static final Logger LOG = LoggerFactory.getLogger(PurchaseService.class);

    private final PurchaseRepository purchaseRepository;

    private final OrderItemRepository orderItemRepository;

    private final OrganizationRepository organizationRepository;

    private final CustomerRepository customerRepository;

    private final VolunteerRepository volunteerRepository;

    private final ModeratorRepository moderatorRepository;

    private final MessageSender messageSender;

    private static final Gauge PURCHASES = Gauge.build()
            .name("elsa_hilft_purchases")
            .labelNames("state")
            .help("Number of purchases by state")
            .register();

    private final String[] EXPORT_CSV_HEADER = {"Auftrag #", "Auftrag Status", "Auftrag Datum", "Auftrag Zahlungsmethode", "Auftrag Kosten", "Helfer Name", "Helfer Vorname", "Helfer Adresse", "Helfer PLZ", " Helfer Wohnort", "Helfer Geb.Dat.", "Helfer IBAN", "Helfer Bank", "Helfer Entschädigung", "Kunde Name", "Kunde Vorname", "Kunde Adresse", "Kunde PLZ", "Kunde Wohnort"};

    public PurchaseService(PurchaseRepository purchaseRepository, OrderItemRepository orderItemRepository, OrganizationRepository organizationRepository, CustomerRepository customerRepository, VolunteerRepository volunteerRepository, ModeratorRepository moderatorRepository, MessageSender messageSender) {
        this.purchaseRepository = purchaseRepository;
        this.orderItemRepository = orderItemRepository;
        this.organizationRepository = organizationRepository;
        this.customerRepository = customerRepository;
        this.volunteerRepository = volunteerRepository;
        this.moderatorRepository = moderatorRepository;
        this.messageSender = messageSender;
    }

    public PurchaseDTO create(Principal principal, CreatePurchaseRequest req) {
        Purchase purchase = createPurchase(principal, req);
        return new PurchaseDTO(purchase);
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
        purchase.setStatus(Purchase.Status.NEW);
        purchase.setCreateTime();

        // responsible is creator by default
        purchase.setResponsibleModeratorId(moderator.getId());

        purchaseRepository.save(purchase);
        return purchase;
    }

    public void publishPurchase(UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        var organization = organizationRepository.findById(1).orElseThrow(NotFoundException::new);
        var customer = customerRepository.findById(purchase.getCustomerId()).orElseThrow(NotFoundException::new);
        messageSender.broadcastPurchase(organization, customer, purchase);
    }

    public List<PurchaseListItemDTO> getPurchases() {
        var purchases = purchaseRepository.findAll();
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

    public FetchedPurchaseDTO getFetchedPurchase(UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        var assignedVolunteer = purchase.getAssignedVolunteer().flatMap(volunteerRepository::findById).orElse(null);
        var volunteerApplications = volunteerRepository.findAllById(purchase.getVolunteerApplications());

        // The following entities are loaded from not-null foreign keys, they should never fail
        var customer = customerRepository.findById(purchase.getCustomerId()).get();
        var createdBy = moderatorRepository.findById(purchase.getCreatedByModerator()).get();
        var responsible = moderatorRepository.findById(purchase.getResponsibleModeratorId()).get();

        return new FetchedPurchaseDTO(purchase, assignedVolunteer, volunteerApplications, customer, createdBy, responsible);
    }

    public Optional<PurchaseDTO> getPurchase(UUID purchaseId) {
        return purchaseRepository.findByUuid(purchaseId).map(PurchaseDTO::new);
    }

    public void assignVolunteer(UUID purchaseId, UUID volunteerId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        var volunteer = volunteerRepository.findByUuid(volunteerId).orElseThrow(NotFoundException::new);
        var customer = customerRepository.findById(purchase.getCustomerId()).orElseThrow(NotFoundException::new);

        if (!purchase.getVolunteerApplications().contains(volunteer.getId())) {
            LOG.error("Assigned volunteer who didn't volunteer");
            return;
        }

        if (purchase.getStatus() != Purchase.Status.VOLUNTEER_FOUND) {
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
        purchase.setPurchaseSize(updateRequest.size);
        purchase.setPaymentMethod(updateRequest.paymentMethod);
        purchase.setTiming(updateRequest.timing);
        purchase.setCost(updateRequest.cost);

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

        var moderator = moderatorRepository.findByUuid(updateRequest.responsibleModerator).orElseThrow(BadRequestException::new);
        purchase.setResponsibleModeratorId(moderator.getId());
    }

    public void customerNotified(UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        var volunteer = purchase.getAssignedVolunteer().flatMap(volunteerRepository::findById).orElseThrow(NotFoundException::new);
        var customer = customerRepository.findById(purchase.getCustomerId()).orElseThrow(NotFoundException::new);
        var organization = organizationRepository.findById(1).orElseThrow(NotFoundException::new);

        if (purchase.getStatus() == Purchase.Status.PURCHASE_DONE) {

            purchase.setStatus(Purchase.Status.CUSTOMER_NOTIFIED);
            messageSender.informToDeliverPurchase(purchase, volunteer, customer, organization.getTelegramSupportChat());
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

    public ReceiptDTO getReceipt(UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        return new ReceiptDTO(purchase.getReceipt(), purchase.getReceiptMimeType());
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
        List<Purchase> allPurchases = purchaseRepository.findAll(Sort.by("createTime"));

        CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.EXCEL.withDelimiter(';')
                                    .withHeader(EXPORT_CSV_HEADER));

        for(Purchase purchase : allPurchases) {
            LocalDate createDate = LocalDate.ofInstant(purchase.getCreateTime(), ZoneId.systemDefault());
            if (createDate.isBefore(startDate)) {
                continue;
            }
            if (createDate.isAfter(endDate)) {
                break;
            }
            var customer = customerRepository.findById(purchase.getCustomerId());
            var volunteer = purchase.getAssignedVolunteer().flatMap(volunteerRepository::findById);
            purchase.writeToCsv(csvPrinter, customer, volunteer);
        }
    }

    public void updateSummary() {
        List<PurchaseRepository.PurchaseSummary> summaries = purchaseRepository.summarizeByState();
        summaries.forEach(s -> PURCHASES.labels(s.getStatus().name()).set(s.getNumberOfPurchases()));
    }
}
