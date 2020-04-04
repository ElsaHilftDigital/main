package de.njsm.versusvirus.backend.telegram.dto;

import org.junit.Test;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

public class MessageEntityTest {

    @Test
    public void testPlain() {
        MessageEntity uut = new MessageEntity("", 0, 19);
        String command = "/start@elsahilftbot xxx";

        String output = uut.extractCommand(command);

        assertEquals(command, output);
    }

    @Test
    public void testPrefix() {
        MessageEntity uut = new MessageEntity("", 13, 19);
        String command = "/start@elsahilftbot xxx";

        String output = uut.extractCommand("some garbage\n" + command + "\n");

        assertEquals(command, output);
    }

    @Test
    public void testPostfixLinebreak() {
        MessageEntity uut = new MessageEntity("", 0, 19);
        String command = "/start@elsahilftbot xxx";

        String output = uut.extractCommand(command + "\n");

        assertEquals(command, output);
    }

    @Test
    public void testPostfix() {
        MessageEntity uut = new MessageEntity("", 0, 19);
        String command = "/start@elsahilftbot xxx";

        String output = uut.extractCommand(command + "\ngarbage");

        assertEquals(command, output);
    }
}