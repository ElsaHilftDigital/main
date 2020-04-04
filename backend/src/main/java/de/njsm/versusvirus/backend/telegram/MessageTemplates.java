package de.njsm.versusvirus.backend.telegram;

import de.njsm.versusvirus.backend.domain.Purchase;

import java.util.List;

/**
 * Markdown syntax of telegram
 * https://core.telegram.org/bots/api#markdown-style
 */
public class MessageTemplates {

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
