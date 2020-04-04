package de.njsm.versusvirus.backend.telegram;

import org.junit.Test;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

public class BotCommandTest {

    @Test
    public void testCommandParsing() {
        assertTrue(BotCommand.HILFE_ANBIETEN.getRegex().asPredicate().test("/hilfe_anbieten@elsahilftbot xxx"));
        assertTrue(BotCommand.HILFE_ANBIETEN.getRegex().asPredicate().test("/hilfe_anbieten yxy"));
    }
}