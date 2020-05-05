package de.njsm.versusvirus.backend.service.events;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class EventService {

    public SseEmitter subscribe(SseEmitter subscription) {
        return subscription;
    }
}
