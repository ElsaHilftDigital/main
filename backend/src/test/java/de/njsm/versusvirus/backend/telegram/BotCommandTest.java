package de.njsm.versusvirus.backend.telegram;

import org.junit.Test;

import java.util.regex.Matcher;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class BotCommandTest {

    @Test
    public void testCommandParsing() {
        assertTrue(BotCommand.HILFE_ANBIETEN.getRegex().asPredicate().test("/start@elsahilftbot hilfeanbieten_xxx"));
        assertTrue(BotCommand.HILFE_ANBIETEN.getRegex().asPredicate().test("/start hilfeanbieten_yxy"));

        Matcher m = BotCommand.HILFE_ANBIETEN.getRegex()
                .matcher("/start@elsahilftbot hilfeanbieten_xxx");
        m.find();
        assertEquals("xxx", m.group("purchaseId"));
    }

    @Test
    public void testStartCommandParsing() {
        assertTrue(BotCommand.START.getRegex().asPredicate().test("/start@elsahilftbot xxx"));
        assertTrue(BotCommand.START.getRegex().asPredicate().test("/start yxy"));

        Matcher m = BotCommand.START.getRegex()
                .matcher("/start@elsahilftbot xxx");
        m.find();
        assertEquals("xxx", m.group("userId"));
    }

    @Test
    public void testAbschliessenCommandParsing() {
        assertTrue(BotCommand.ABSCHLIESSEN.getRegex().asPredicate().test("/start@elsahilftbot abschliessen_uuid_false"));
        assertTrue(BotCommand.ABSCHLIESSEN.getRegex().asPredicate().test("/start abschliessen_uuid_true"));

        Matcher m = BotCommand.ABSCHLIESSEN.getRegex()
                .matcher("/start@elsahilftbot abschliessen_uuid_false");
        m.find();
        assertEquals("uuid", m.group("purchaseId"));
        assertEquals("false", m.group("isSuccess"));
    }
}