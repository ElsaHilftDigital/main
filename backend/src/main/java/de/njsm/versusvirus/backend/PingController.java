package de.njsm.versusvirus.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class PingController {

    @CrossOrigin
    @GetMapping("/ping")
    public String ping() {
        return "Hello World";
    }
}
