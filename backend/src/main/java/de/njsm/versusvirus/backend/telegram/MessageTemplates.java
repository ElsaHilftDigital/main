package de.njsm.versusvirus.backend.telegram;

/**
 * Markdown syntax of telegram
 * https://core.telegram.org/bots/api#markdown-style
 */
public enum MessageTemplates {

    CONFIRM_PRELIMINARY_REGISTRATION {

        @Override
        public String getTemplate() {
            return "Hi {0}, please wait to be confirmed";
        }
    },

    CONFIRM_REGISTRATION {
        @Override
        public String getTemplate() {
            return "Hi {0}, you are confirmed. join {1}";
        }
    }

    ;

    public abstract String getTemplate();
}
