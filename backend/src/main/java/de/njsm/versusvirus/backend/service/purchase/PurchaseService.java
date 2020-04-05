package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.OrderItem;
import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.repository.*;
import de.njsm.versusvirus.backend.service.volunteer.VolunteerDTO;
import de.njsm.versusvirus.backend.spring.web.NotFoundException;
import de.njsm.versusvirus.backend.telegram.MessageSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PurchaseService {

    private static final Logger LOG = LoggerFactory.getLogger(PurchaseService.class);

    private final PurchaseRepository purchaseRepository;

    private final OrderItemRepository orderItemRepository;

    private final OrganizationRepository organizationRepository;

    private final CustomerRepository customerRepository;

    private final VolunteerRepository volunteerRepository;

    private final ModeratorRepository moderatorRepository;

    private final MessageSender messageSender;

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
        var purchase = new Purchase();
        var moderator = moderatorRepository.findByLogin(principal.getName()).orElseThrow(NotFoundException::new);
        var customer = customerRepository.findByUuid(req.customer).orElseThrow(NotFoundException::new);

        for (String item : req.orderItems) {
            var orderItem = new OrderItem();
            orderItem.setPurchaseItem(item);
            purchase.addOrderItem(orderItem);
        }

        purchase.setPaymentMethod(req.paymentMethod);
        purchase.setTiming(req.timing);
        purchase.setSupermarket(req.supermarket);
        purchase.setPurchaseSize(req.purchaseSize);
        purchase.setComments(req.comments);
        purchase.setCreatedByModerator(moderator.getId());
        purchase.setCustomer(customer.getId());
        purchase.setStatus(Purchase.Status.NEW);
        purchase.setCreateTime();

        purchaseRepository.save(purchase);

        var organization = organizationRepository.findById(1).orElseThrow(NotFoundException::new);
        messageSender.broadcastPurchase(organization, customer, purchase);

        return new PurchaseDTO(purchase);
    }

    public List<PurchaseDTO> getPurchases() {
        return purchaseRepository.findAll()
                .stream()
                .map(PurchaseDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<PurchaseDTO> getPurchase(UUID purchaseId) {
        return purchaseRepository.findByUuid(purchaseId).map(PurchaseDTO::new);
    }

    public void assignVolunteer(UUID purchaseId, UUID volunteerId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        var volunteer = volunteerRepository.findByUuid(volunteerId).orElseThrow(NotFoundException::new);
        var customer = customerRepository.findById(purchase.getCustomer()).orElseThrow(NotFoundException::new);

        if (!purchase.getVolunteerApplications().contains(volunteer.getId())) {
            LOG.error("Assigned volunteer who didn't volunteer");
            return;
        }

        if (purchase.getStatus() != Purchase.Status.VOLUNTEER_FOUND) {
            LOG.error("This purchase is in the unexpected state " + purchase.getStatus().name());
            return;
        }

        messageSender.offerPurchase(purchase, customer, volunteer);
    }

    public void customerNotified(UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        var volunteer = volunteerRepository.findById(purchase.getAssignedVolunteer()).orElseThrow(NotFoundException::new);

        purchase.setStatus(Purchase.Status.CUSTOMER_NOTIFIED);
        messageSender.informToDeliverPurchase(purchase, volunteer);
    }

    public void markCompleted(UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        purchase.setStatus(Purchase.Status.PURCHASE_COMPLETED);
    }

    public List<VolunteerDTO> getAvailableVolunteers(UUID purchaseId) {
        var purchase = purchaseRepository.findByUuid(purchaseId).orElseThrow(NotFoundException::new);
        return volunteerRepository.findByIdIn(purchase.getVolunteerApplications())
                .stream()
                .map(VolunteerDTO::new)
                .collect(Collectors.toList());
    }
}
