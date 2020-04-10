package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.CallbackQueryAnswer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class CallbackReplyerMock implements CallbackQueryReplyer {

    private static final Logger LOG = LoggerFactory.getLogger(CallbackReplyerMock.class);

    @Override
    public void answerCallbackQuery(CallbackQueryAnswer query) {
        LOG.info("Mock confirms that callback query {} was answered", query.getCallbackQueryId());
    }
}
