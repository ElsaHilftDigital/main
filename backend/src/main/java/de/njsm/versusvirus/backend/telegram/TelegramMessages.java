package de.njsm.versusvirus.backend.telegram;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@PropertySource("classpath:messages.properties")
@Configuration
@ConfigurationProperties(prefix = "telegram")
public class TelegramMessages {

    private String preconfirmRegistration;
    private String confirmRegistration;
    private String broadcastPurchase;
    private String offerPurchase;
    private String confirmPurchaseMapping;
    private String inforToDeliverPurchase;

    public void setPreconfirmRegistration(String preconfirmRegistration) {
        this.preconfirmRegistration = preconfirmRegistration;
    }

    public String getPreconfirmRegistration() {
        return preconfirmRegistration;
    }

    public String getConfirmRegistration() {
        return confirmRegistration;
    }

    public void setConfirmRegistration(String confirmRegistration) {
        this.confirmRegistration = confirmRegistration;
    }

    public String getBroadcastPurchase() {
        return broadcastPurchase;
    }

    public void setBroadcastPurchase(String broadcastPurchase) {
        this.broadcastPurchase = broadcastPurchase;
    }

    public String getOfferPurchase() {
        return offerPurchase;
    }

    public void setOfferPurchase(String offerPurchase) {
        this.offerPurchase = offerPurchase;
    }

    public String getConfirmPurchaseMapping() {
        return confirmPurchaseMapping;
    }

    public void setConfirmPurchaseMapping(String confirmPurchaseMapping) {
        this.confirmPurchaseMapping = confirmPurchaseMapping;
    }

    public String getInforToDeliverPurchase() {
        return inforToDeliverPurchase;
    }

    public void setInforToDeliverPurchase(String inforToDeliverPurchase) {
        this.inforToDeliverPurchase = inforToDeliverPurchase;
    }
}
