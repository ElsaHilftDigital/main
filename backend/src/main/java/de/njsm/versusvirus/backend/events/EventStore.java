package de.njsm.versusvirus.backend.events;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Component
public class EventStore {

    private final EventService eventService;
    private final DbNotificationRepository repository;
    private long lastNotificationId;

    public EventStore(EventService eventService,
                      DbNotificationRepository repository
    ) {
        this.eventService = eventService;
        this.repository = repository;
        lastNotificationId = repository.lastNotificationId().orElse(0L);
    }

    public void publish(Event event) {
        var dbEvent = new DbEvent();
        dbEvent.setTopic(event.topic().toString());
        dbEvent.setData(event.data());
        repository.save(dbEvent);
    }

    @Scheduled(fixedDelay = 100)
    private void poll() {
        List<DbEvent> newEvents = fetchNewNotifications();
        newEvents.forEach(eventService::handleEvent);
    }

    private List<DbEvent> fetchNewNotifications() {
        return repository.findNewNotifications(lastNotificationId)
                .stream()
                .peek(event -> lastNotificationId = Math.max(event.getId(), lastNotificationId))
                .collect(toList());
    }
}
