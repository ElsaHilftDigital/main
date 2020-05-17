package de.njsm.versusvirus.backend.events;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EventStore {

    private final DbEventRepository repository;

    public EventStore(DbEventRepository repository) {
        this.repository = repository;
    }

    long lastEventId() {
        return repository.lastEventId().orElse(0L);
    }

    public void publish(Event event) {
        var dbEvent = new DbEvent();
        dbEvent.setTopic(event.topic().toString());
        dbEvent.setData(event.data());
        repository.save(dbEvent);
    }

    List<DbEvent> getNewNotifications(long lastEventId) {
        return repository.findNewEvents(lastEventId);
    }
}
