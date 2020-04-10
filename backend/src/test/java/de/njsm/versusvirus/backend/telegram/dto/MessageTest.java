package de.njsm.versusvirus.backend.telegram.dto;

import org.junit.Test;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

public class MessageTest {

    @Test
    public void testMessageEntityPurging1() {
        var uut = buildMessage("/start 173b3717-1fe6-437a-9838-eea564bf801d",
                new MessageEntity("bot_command", 0, 6));

        assertEquals("", uut.getPurgedText());
    }

    @Test
    public void testMessageEntityPurging2() {
        var uut = buildMessage("/start",
                new MessageEntity("bot_command", 0, 6));

        assertEquals("", uut.getPurgedText());
    }

    @Test
    public void testMessageEntityPurging3() {
        var uut = buildMessage("test/start",
                new MessageEntity("bot_command", 4, 6));

        assertEquals("test", uut.getPurgedText());
    }

    @Test
    public void testMessageEntityPurging4() {
        var uut = buildMessage("test/start\ntest",
                new MessageEntity("bot_command", 4, 6));

        assertEquals("test\ntest", uut.getPurgedText());
    }

    private Message buildMessage(String text, MessageEntity... entities) {
        Message result = new Message();
        result.setText(text);
        result.setEntities(entities);
        return result;
    }

}