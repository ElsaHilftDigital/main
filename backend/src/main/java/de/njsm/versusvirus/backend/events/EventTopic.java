package de.njsm.versusvirus.backend.events;

public enum EventTopic {
    NOTIFICATION;

    @Override
    public String toString() {
        return this.name().toLowerCase();
    }
}
