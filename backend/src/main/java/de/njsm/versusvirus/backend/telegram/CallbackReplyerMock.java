package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.CallbackQueryAnswer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CallbackReplyerMock implements CallbackQueryReplyer {

    private static final Logger LOG = LoggerFactory.getLogger(CallbackReplyerMock.class);

    @Override
    public void answerCallbackQuery(CallbackQueryAnswer query) {
        LOG.info("Mock confirms that callback query {} was answered", query.getCallbackQueryId());
    }
}
