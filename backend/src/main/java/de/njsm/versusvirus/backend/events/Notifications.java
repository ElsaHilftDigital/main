package de.njsm.versusvirus.backend.events;

import de.njsm.versusvirus.backend.domain.Moderator;
import de.njsm.versusvirus.backend.domain.Purchase;

import static java.lang.String.format;

public final class Notifications {

    public static Notification volunteerRegistered() {
        return new Notification("Registration", "Ein/-e neue/-r Helfer/-in hat sich registriert und sollte freigeschaltet werden");
    }

    public static Notification helpersHaveApplied(Purchase purchase, Moderator responsible) {
        return new Notification("Hilfe anbieten", format("Jemand hat sich für den Einkauf %s gemeldet. Bitte eine/-n Helfer/-in auswählen.\nZuständige/-r Moderator/-in: %s", purchase.getId(), responsible.getName()));
    }

    public static Notification helperHasRejected(Purchase purchase, Moderator responsible) {
        return new Notification("Einkauf abgelehnt", format("Ein Helfer hat den Einkauf %s abgelehnt. Bitte einen neuen Helfer auswählen.\nZuständige/-r Moderator/-in: %s", purchase.getId(), responsible.getName()));
    }

    public static Notification receiptHasBeenSubmitted(Purchase purchase, Moderator responsible) {
        return new Notification("Quittung eingereicht", format("Eine neue Quittung wurde hochgeladen für Einkauf %s und sollte kontrolliert werden.\nZuständige/-r Moderator/-in: %s", purchase.getId(), responsible.getName()));
    }

    public static Notification moneyWasMissing(Purchase purchase, Moderator responsible) {
        return new Notification("Geld fehlt", format("Beim Einkauf %s hat das Geld gefehlt.\nZuständige/-r Moderator/-in: %s", purchase.getId(), responsible.getName()));
    }
}
