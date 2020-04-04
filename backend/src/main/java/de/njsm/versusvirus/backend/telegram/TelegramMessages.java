package de.njsm.versusvirus.backend.telegram;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@PropertySource("classpath:messages.properties")
@Configuration
@ConfigurationProperties(prefix = "telegram")
public class TelegramMessages {

    private String unknownVolunteer;
    private String unknownVolunteerResignation;
    private String volunteerResignation;

    private String preconfirmRegistration;
    private String confirmRegistration;
    private String broadcastPurchase;
    private String purchaseAlreadyTaken;
    private String blameHackingUser;
    private String offerPurchase;
    private String confirmPurchaseMapping;
    private String informToDeliverPurchase;
    private String noActivePurchases;
    private String thankForOfferingHelp;
    private String thankForDoingPurchase;
    private String unexpectedMessage;
    private String confirmReceiptUpload;
    private String confirmRejection;
    private String broadcastPurchaseDescription;
    private String personalPurchaseDescription;

    private String newHelperHasRegistered;
    private String helpersAppliedForPurchase;
    private String helperRejectedPurchase;
    private String receiptHasBeenSubmitted;

    public String getUnknownVolunteer() {
        return unknownVolunteer;
    }

    public void setUnknownVolunteer(String unknownVolunteer) {
        this.unknownVolunteer = unknownVolunteer;
    }

    public String getUnknownVolunteerResignation() {
        return unknownVolunteerResignation;
    }

    public void setUnknownVolunteerResignation(String unknownVolunteerResignation) {
        this.unknownVolunteerResignation = unknownVolunteerResignation;
    }

    public String getVolunteerResignation() {
        return volunteerResignation;
    }

    public void setVolunteerResignation(String volunteerResignation) {
        this.volunteerResignation = volunteerResignation;
    }

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

    public String getInformToDeliverPurchase() {
        return informToDeliverPurchase;
    }

    public void setInformToDeliverPurchase(String informToDeliverPurchase) {
        this.informToDeliverPurchase = informToDeliverPurchase;
    }

    public String getPurchaseAlreadyTaken() {
        return purchaseAlreadyTaken;
    }

    public void setPurchaseAlreadyTaken(String purchaseAlreadyTaken) {
        this.purchaseAlreadyTaken = purchaseAlreadyTaken;
    }

    public String getBlameHackingUser() {
        return blameHackingUser;
    }

    public void setBlameHackingUser(String blameHackingUser) {
        this.blameHackingUser = blameHackingUser;
    }

    public String getNoActivePurchases() {
        return this.noActivePurchases;
    }

    public void setNoActivePurchases(String noActivePurchases) {
        this.noActivePurchases = noActivePurchases;
    }

    public void setThankForOfferingHelp(String thankForOfferingHelp) {
        this.thankForOfferingHelp = thankForOfferingHelp;
    }

    public String getThankForDoingPurchaseMessage() {
        return this.thankForDoingPurchase;
    }

    public void setThankForDoingPurchase(String thankForDoingPurchase) {
        this.thankForDoingPurchase = thankForDoingPurchase;
    }

    public String getUnexpectedMessage() {
        return this.unexpectedMessage;
    }

    public void setUnexpectedMessage(String unexpectedMessage) {
        this.unexpectedMessage = unexpectedMessage;
    }

    public String getConfirmReceiptUpload() {
        return this.confirmReceiptUpload;
    }

    public void setConfirmReceiptUpload(String confirmReceiptUpload) {
        this.confirmReceiptUpload = confirmReceiptUpload;
    }

    public String getConfirmRejection() {
        return this.confirmRejection;
    }

    public void setConfirmRejection(String confirmRejection) {
        this.confirmRejection = confirmRejection;
    }

    public String getBroadcastPurchaseDescription() {
        return this.broadcastPurchaseDescription;
    }

    public void setBroadcastPurchaseDescription(String broadcastPurchaseDescription) {
        this.broadcastPurchaseDescription = broadcastPurchaseDescription;
    }

    public String getPersonalPurchaseDescription() {
        return this.personalPurchaseDescription;
    }

    public void setPersonalPurchaseDescription(String personalPurchaseDescription) {
        this.personalPurchaseDescription = personalPurchaseDescription;
    }

    public String getThankForOfferingHelp() {
        return thankForOfferingHelp;
    }

    public String getThankForDoingPurchase() {
        return thankForDoingPurchase;
    }

    public String getNewHelperHasRegistered() {
        return newHelperHasRegistered;
    }

    public void setNewHelperHasRegistered(String newHelperHasRegistered) {
        this.newHelperHasRegistered = newHelperHasRegistered;
    }

    public String getHelpersAppliedForPurchase() {
        return helpersAppliedForPurchase;
    }

    public void setHelpersAppliedForPurchase(String helpersAppliedForPurchase) {
        this.helpersAppliedForPurchase = helpersAppliedForPurchase;
    }

    public String getHelperRejectedPurchase() {
        return helperRejectedPurchase;
    }

    public void setHelperRejectedPurchase(String helperRejectedPurchase) {
        this.helperRejectedPurchase = helperRejectedPurchase;
    }

    public String getReceiptHasBeenSubmitted() {
        return receiptHasBeenSubmitted;
    }

    public void setReceiptHasBeenSubmitted(String receiptHasBeenSubmitted) {
        this.receiptHasBeenSubmitted = receiptHasBeenSubmitted;
    }
}
