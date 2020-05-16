package de.njsm.versusvirus.backend.rest.api.events;

import de.njsm.versusvirus.backend.events.EventService;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<SseEmitter> events(@RequestHeader("Last-Event-Id") Long lastEventId) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl
                        .noCache()
                        .noTransform())
                .body(eventService.subscribe(lastEventId));
    }
}
