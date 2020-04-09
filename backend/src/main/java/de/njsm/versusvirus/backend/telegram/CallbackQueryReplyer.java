package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.telegram.dto.CallbackQueryAnswer;

public interface CallbackQueryReplyer {

    void answerCallbackQuery(CallbackQueryAnswer query);

}
