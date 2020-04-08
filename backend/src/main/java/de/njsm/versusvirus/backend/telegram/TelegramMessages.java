package de.njsm.versusvirus.backend.telegram;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@PropertySource(value = "classpath:messages.properties", encoding = "utf-8")
@Configuration
@ConfigurationProperties(prefix = "telegram")
public class TelegramMessages {

    private String unknownVolunteer;
    private String unknownVolunteerResignation;
    private String volunteerResignation;

    private String preconfirmRegistration;
    private String confirmRegistration;
    private String broadcastPurchase;
    private String offerHelp;
    private String purchaseAlreadyTaken;
    private String blameHackingUser;
    private String offerPurchase;
    private String yes;
    private String no;
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
    private String everythingFound;
    private String moneyWasMissing;
    private String confirmInvestigation;
    private String confirmCompletion;
    private String moneyIsMissing;
    private String unexpectedImage;
    private String forwardedMessage;

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

    public String getEverythingFound() {
        return everythingFound;
    }

    public void setEverythingFound(String everythingFound) {
        this.everythingFound = everythingFound;
    }

    public String getMoneyWasMissing() {
        return moneyWasMissing;
    }

    public void setMoneyWasMissing(String moneyWasMissing) {
        this.moneyWasMissing = moneyWasMissing;
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

    public String getConfirmInvestigation() {
        return this.confirmInvestigation;
    }

    public void setConfirmInvestigation(String confirmInvestigation) {
        this.confirmInvestigation = confirmInvestigation;
    }

    public String getConfirmCompletion() {
        return this.confirmCompletion;
    }

    public void setConfirmCompletion(String confirmCompletion) {
        this.confirmCompletion = confirmCompletion;
    }

    public String getMoneyIsMissing() {
        return this.moneyIsMissing;
    }

    public void setMoneyIsMissing(String moneyIsMissing) {
        this.moneyIsMissing = moneyIsMissing;
    }

    public String getUnexpectedImage() {
        return this.unexpectedImage;
    }

    public void setUnexpectedImage(String unexpectedImage) {
        this.unexpectedImage = unexpectedImage;
    }

    public String getOfferHelp() {
        return offerHelp;
    }

    public void setOfferHelp(String offerHelp) {
        this.offerHelp = offerHelp;
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public String getYes() {
        return yes;
    }

    public void setYes(String yes) {
        this.yes = yes;
    }

    public String getForwardedMessage() {
        return this.forwardedMessage;
    }

    public void setForwardedMessage(String forwardedMessage) {
        this.forwardedMessage = forwardedMessage;
    }
}
