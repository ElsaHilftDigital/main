package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.OrderItem;
import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.repository.*;
import de.njsm.versusvirus.backend.spring.web.NotFoundException;
import de.njsm.versusvirus.backend.telegram.MessageSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

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

    private final MessageSender messageSender;

    public PurchaseService(PurchaseRepository purchaseRepository, OrderItemRepository orderItemRepository, OrganizationRepository organizationRepository, CustomerRepository customerRepository, VolunteerRepository volunteerRepository, MessageSender messageSender) {
        this.purchaseRepository = purchaseRepository;
        this.orderItemRepository = orderItemRepository;
        this.organizationRepository = organizationRepository;
        this.customerRepository = customerRepository;
        this.volunteerRepository = volunteerRepository;
        this.messageSender = messageSender;
    }


    public PurchaseDTO create(CreatePurchaseRequest req) {
        var purchase = new Purchase();
        var items = new ArrayList<OrderItem>();
        var customer = customerRepository.findByUuid(req.customer).orElseThrow(NotFoundException::new);

        for (String item : req.orderItems) {
            var orderItem = new OrderItem();
            orderItem.setPurchaseItem(item);
            orderItemRepository.save(orderItem);
            items.add(orderItem);
        }

        purchase.setPurchaseList(items);
        purchase.setPaymentMethod(req.paymentMethod);
        purchase.setTiming(req.timing);
        purchase.setSupermarket(req.supermarket);
        purchase.setPurchaseSize(req.size);
        purchase.setComments(req.comments);
        purchase.setCreatedByModerator(req.createdByModerator); // TODO get from login context
        purchase.setCustomer(customer.getId());
        purchase.setStatus(Purchase.Status.NEW);
        purchase.setCreateTime();

        purchaseRepository.save(purchase);

        var organization = organizationRepository.findById(1).orElseThrow(NotFoundException::new);
        messageSender.broadcastPurchase(organization, customer, purchase);

        purchaseRepository.save(purchase);
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
}
