package de.njsm.versusvirus.backend.telegram.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class InlineKeyboardMarkup {

    @JsonProperty("inline_keyboard")
    private InlineKeyboardButton[][] buttons;

    public InlineKeyboardMarkup(InlineKeyboardButton... buttons) {
        this.buttons = new InlineKeyboardButton[buttons.length][1];
        for (int i = 0; i < buttons.length; i++) {
            this.buttons[i][0] = buttons[i];
        }
    }
}
