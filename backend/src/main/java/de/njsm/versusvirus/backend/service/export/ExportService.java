package de.njsm.versusvirus.backend.service.export;

import de.njsm.versusvirus.backend.domain.Customer;
import de.njsm.versusvirus.backend.domain.Purchase;
import de.njsm.versusvirus.backend.repository.CustomerRepository;
import de.njsm.versusvirus.backend.repository.PurchaseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.OutputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@Transactional(readOnly = true)
public class ExportService {

    private static final Logger LOG = LoggerFactory.getLogger(ExportService.class);

    private final PurchaseRepository purchaseRepository;
    private final CustomerRepository customerRepository;

    public ExportService(PurchaseRepository purchaseRepository,
                         CustomerRepository customerRepository) {
        this.purchaseRepository = purchaseRepository;
        this.customerRepository = customerRepository;
    }

    public void exportReceiptsZip(OutputStream outputStream, LocalDate from, LocalDate to) {
        try (var zipStream = new ZipOutputStream(outputStream)) {
            var rootDirectoryName = String.format("Quittungen_von_%s_bis_%s/", from, to);
            zipStream.putNextEntry(new ZipEntry(rootDirectoryName));

            var groupedPurchases = purchaseRepository.findAllInRange(from.atStartOfDay(ZoneId.systemDefault()).toInstant(), to.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant())
                    .stream()
                    .filter(purchase -> purchase.getNumberReceipts() > 0)
                    .collect(Collectors.groupingBy(Purchase::getCustomerId));
            var customers = customerRepository.findAllById(groupedPurchases.keySet())
                    .stream()
                    .collect(Collectors.toMap(Customer::getId, Function.identity()));

            for (var entry : groupedPurchases.entrySet()) {
                var customer = customers.get(entry.getKey());
                var purchases = entry.getValue();
                var currentDirectory = String.format("%s%s_%s_%s/", rootDirectoryName, customer.getId(), customer.getFirstName(), customer.getLastName());
                zipStream.putNextEntry(new ZipEntry(currentDirectory));
                for (var purchase : purchases) {
                    int i = 1;
                    for (var supermarket : purchase.getPurchaseSupermarketList()) {
                        var fileName = currentDirectory + purchase.getId() + "_" + i + "." + supermarket.getReceiptFileExtension();
                        zipStream.putNextEntry(new ZipEntry(fileName));
                        zipStream.write(supermarket.getReceipt());
                        i++;
                    }
                }
            }
        } catch (Exception e) {
            LOG.error("Failed to export receipts");
            throw new RuntimeException(e);
        }
    }
}
