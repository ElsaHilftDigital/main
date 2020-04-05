package de.njsm.versusvirus.backend.telegram;

import org.junit.Test;

import java.util.regex.Matcher;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class BotCommandTest {

    @Test
    public void testCommandParsing() {
        assertTrue(BotCommand.HILFE_ANBIETEN.getRegex().asPredicate().test("/hilfe_anbieten@elsahilftbot xxx"));
        assertTrue(BotCommand.HILFE_ANBIETEN.getRegex().asPredicate().test("/hilfe_anbieten yxy"));

        Matcher m = BotCommand.HILFE_ANBIETEN.getRegex()
                .matcher("/hilfe_anbieten@elsahilftbot xxx");
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
        assertTrue(BotCommand.ABSCHLIESSEN.getRegex().asPredicate().test("/abschliessen@elsahilftbot uuid false"));
        assertTrue(BotCommand.ABSCHLIESSEN.getRegex().asPredicate().test("/abschliessen uuid true"));

        Matcher m = BotCommand.ABSCHLIESSEN.getRegex()
                .matcher("/abschliessen@elsahilftbot uuid true");
        m.find();
        assertEquals("uuid", m.group("purchaseId"));
        assertEquals("true", m.group("isSuccess"));
    }
}