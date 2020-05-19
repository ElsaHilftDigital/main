package de.njsm.versusvirus.backend.events;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;

import static java.lang.Math.max;
import static org.springframework.beans.factory.config.ConfigurableBeanFactory.SCOPE_SINGLETON;
import static org.springframework.web.servlet.mvc.method.annotation.SseEmitter.event;

@Service
@Scope(SCOPE_SINGLETON)
public class EventService {

    private static final Logger LOG = LoggerFactory.getLogger(EventService.class);

    private final EventStore eventStore;
    private final CopyOnWriteArrayList<SseEmitter> emitters;
    private long lastEventId;

    public EventService(EventStore eventStore) {
        this.eventStore = eventStore;
        this.emitters = new CopyOnWriteArrayList<>();
        this.lastEventId = eventStore.lastEventId();
    }

    public SseEmitter subscribe(Long lastEventId) {
        SseEmitter emitter = new SseEmitter();
        emitter.onCompletion(() -> unsubscribe(emitter));
        emitter.onTimeout(() -> {
            emitter.complete();
            unsubscribe(emitter);
        });
        emitters.add(emitter);
        if (lastEventId != null) {
            eventStore.getNewNotifications(lastEventId)
                    .forEach(event -> sendEvent(emitter, event));
        }
        return emitter;
    }

    private void unsubscribe(SseEmitter emitter) {
        emitters.remove(emitter);
    }

    public void handleEvent(DbEvent event) {
        for (SseEmitter emitter : emitters) {
            sendEvent(emitter, event);
        }
    }

    @Scheduled(fixedDelay = 100)
    void poll() {
        eventStore.getNewNotifications(lastEventId)
                .forEach(event -> {
                    lastEventId = max(lastEventId, event.getId());
                    handleEvent(event);
                });
    }

    private void sendEvent(SseEmitter emitter, DbEvent event) {
        try {
            emitter.send(event()
                    .name(event.getTopic())
                    .data(event.getData())
                    .id(Long.toString(event.getId())));
        } catch (IOException ioException) {
            // This is a copy on write list, we can safely modify it
            emitter.completeWithError(ioException);
            unsubscribe(emitter);
        }
    }
}
