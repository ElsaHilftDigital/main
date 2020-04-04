package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.Purchase;

import java.util.List;

/**
 * Markdown syntax of telegram
 * https://core.telegram.org/bots/api#markdown-style
 */
public enum MessageTemplates {

    UNKNOWN_HELPER {
        @Override
        public String getTemplate() {
            return "I don't know you. Please register on [our website]({0})";
        }
    },

    UNKNOWN_HELPER_RESIGNATION {
        @Override
        public String getTemplate() {
            return "Well, I didn't know you anyway";
        }
    },

    HELPER_RESIGNATION {
        @Override
        public String getTemplate() {
            return "Goodbye, thanks for you help";
        }
    },

    CONFIRM_PRELIMINARY_REGISTRATION {
        @Override
        public String getTemplate() {
            return "Hi {0}, please wait to be confirmed";
        }
    },

    CONFIRM_REGISTRATION {
        @Override
        public String getTemplate() {
            return "Hi {0}, you are confirmed. join [our group chat]({1})";
        }
    },

    BROADCAST_PURCHASE {
        @Override
        public String getTemplate() {
            return "Who wants to do {0}?\n\n" +
                    "[offer help]({1})";
        }
    },

    OFFER_PURCHASE {
        @Override
        public String getTemplate() {
            return "Do you really want to do {0}?\n\n" +
                    "[yes]({1})       [no]({2})";
        }
    },

    CONFIRM_PURCHASE_MAPPING {
        /**
         * see renderPurchaseList()
         */
        @Override
        public String getTemplate() {
            return "To which purchase does this photo belong?\n" +
                    "{0}";
        }
    },

    INFORM_TO_DELIVER_PURCHASE {
        @Override
        public String getTemplate() {
            return "The purchase for {0} can be delivered";
        }
    },

    ;

    public abstract String getTemplate();

    public static String renderPurchaseList(String fileId, List<Purchase> purchases) {
        StringBuilder builder = new StringBuilder();
        for (Purchase p : purchases) {
            builder.append("* ");
            builder.append("[");
            builder.append(p.getSupermarket());
            builder.append("](");
            builder.append(BotCommand.QUITTUNG_EINREICHEN.render(fileId, p.getUuid().toString()));
            builder.append(")\n");
        }
        return builder.toString();
    }
}
