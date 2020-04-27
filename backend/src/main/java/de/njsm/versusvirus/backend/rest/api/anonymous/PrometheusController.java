package de.njsm.versusvirus.backend.rest.api.anonymous;

import de.njsm.versusvirus.backend.service.purchase.PurchaseService;
import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.exporter.common.TextFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@RestController
@RequestMapping("/api/metrics/hufilrshaufkhrusalfjia/${metrics.secret}")
public class PrometheusController {

    private final PurchaseService purchaseService;

    public PrometheusController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @GetMapping
    public void getMetrics(HttpServletResponse response) {
        purchaseService.updateSummary();

        try (PrintWriter writer = response.getWriter()){
            TextFormat.write004(writer,
                    CollectorRegistry.defaultRegistry.metricFamilySamples());

        } catch (IOException e) {}
    }

}
