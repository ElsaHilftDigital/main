package de.njsm.versusvirus.backend.service.purchase;

import de.njsm.versusvirus.backend.domain.OrderItem;
import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.repository.CustomerRepository;
import de.njsm.versusvirus.backend.repository.OrderItemRepository;
import de.njsm.versusvirus.backend.repository.OrganizationRepository;
import de.njsm.versusvirus.backend.repository.PurchaseRepository;
import de.njsm.versusvirus.backend.spring.web.NotFoundException;
import de.njsm.versusvirus.backend.telegram.MessageSender;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;

    private final OrderItemRepository orderItemRepository;

    private final OrganizationRepository organizationRepository;

    private final CustomerRepository customerRepository;

    private final MessageSender messageSender;

    public PurchaseService(PurchaseRepository purchaseRepository, OrderItemRepository orderItemRepository, OrganizationRepository organizationRepository, CustomerRepository customerRepository, MessageSender messageSender) {
        this.purchaseRepository = purchaseRepository;
        this.orderItemRepository = orderItemRepository;
        this.organizationRepository = organizationRepository;
        this.customerRepository = customerRepository;
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
}
