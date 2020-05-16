package de.njsm.versusvirus.backend.telegram;

import java.util.HashSet;

public class MessageUtils {
    static String escapeMarkdownCharacters(String message) {
        HashSet<Character> escapeableCharacters = getEscapeCharacters();
        StringBuilder builder = new StringBuilder();
        for (char c : message.toCharArray()) {
            if (escapeableCharacters.contains(c)) {
                builder.append('\\');
            }
            builder.append(c);
        }
        return builder.toString();
    }

    private static HashSet<Character> getEscapeCharacters() {
        HashSet<Character> escapeableCharacters = new HashSet<>();
        escapeableCharacters.add('_');
        escapeableCharacters.add('*');
        escapeableCharacters.add('[');
        escapeableCharacters.add(']');
        escapeableCharacters.add('(');
        escapeableCharacters.add(')');
        escapeableCharacters.add('~');
        escapeableCharacters.add('`');
        escapeableCharacters.add('>');
        escapeableCharacters.add('#');
        escapeableCharacters.add('+');
        escapeableCharacters.add('-');
        escapeableCharacters.add('=');
        escapeableCharacters.add('|');
        escapeableCharacters.add('{');
        escapeableCharacters.add('}');
        escapeableCharacters.add('.');
        escapeableCharacters.add('!');
        return escapeableCharacters;
    }
}
