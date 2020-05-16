package de.njsm.versusvirus.backend.events;

public interface Event {
    EventTopic topic();
    String data();
}
