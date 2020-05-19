package de.njsm.versusvirus.backend.events;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;

public class Notification implements Event {

    private final String title;
    private final String message;

    public Notification(String title, String message) {
        this.title = title;
        this.message = message;
    }

    @Override
    public EventTopic topic() {
        return EventTopic.NOTIFICATION;
    }

    @Override
    public String data() {
        var objectMapper = new ObjectMapper();
        var data = new HashMap<>();
        data.put("title", title);
        data.put("message", message);
        try {
            return objectMapper.writeValueAsString(data);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
