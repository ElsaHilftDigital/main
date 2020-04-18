package de.njsm.versusvirus.backend.rest.api.admin.export;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/export")
public class ExportController {

    @GetMapping("/receipts")
    public void receipts(@RequestParam() @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                         @RequestParam() @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
                         HttpServletResponse response) {
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=receipts.zip");
    }
}
