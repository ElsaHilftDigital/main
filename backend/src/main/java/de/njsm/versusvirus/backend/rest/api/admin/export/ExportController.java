package de.njsm.versusvirus.backend.rest.api.admin.export;

import de.njsm.versusvirus.backend.service.export.ExportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/admin/export")
public class ExportController {

    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping(value = "/receipts", produces = "application/zip")
    public void receipts(@RequestParam() @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                         @RequestParam() @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
                         HttpServletResponse response) throws IOException {
        var filename = String.format("Quittungen_von_%s_bis_%s.zip", from, to);
        response.setHeader("Content-Disposition", "attachment; filename=" + filename);
        exportService.exportReceiptsZip(response.getOutputStream(), from, to);
    }
}
