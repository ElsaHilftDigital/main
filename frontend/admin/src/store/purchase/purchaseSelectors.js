export const selectPurchases = state => state.purchase.purchases;
export const selectGetPurchasesRequestOngoing = state => state.purchase.getPruchasesRequestOngoing;
export const selectGetPurchasesError = state => state.purchase.getPurchasesError;

export const selectCurrentPurchase = state => state.purchase.currentPurchase;
export const selectGetPurchaseRequestOngoing = state => state.purchase.getPurchaseRequestOngoing;
export const selectGetPurchaseError = state => state.purchase.getPurchaseError;

export const selectCurrentPurchaseReceipt = state => state.purchase.currentPurchaseReceipt;
export const selectGetPurchaseReceiptRequestOngoing = state => state.purchase.getPurchaseReceiptRequestOngoing;
export const selectGetPurchaseReceiptError = state => state.purchase.getPurchaseReceiptError;

export const selectCreatePurchaseRequestOngoing = state => state.purchase.createPurchaseRequestOngoing;
export const selectCreatePurchaseSuccess = state => state.purchase.createPurchaseSuccess;
export const selectCreatePurchaseError = state => state.purchase.createPurchaseError;

export const selectAssignVolunteerRequestOngoing = state => state.purchase.assignVolunteerRequestOngoing;
export const selectAssignVolunteerError = state => state.purchase.assignVolunteerError;

export const selectCustomerNotifiedRequestOngoing = state => state.purchase.customerNotifiedRequestOngoing;
export const selectCustomerNotifiedError = state => state.purchase.customerNotifierError;

export const selectMarkCompleteRequestOngoing = state => state.purchase.markCompletedRequestOngoing;
export const selectMarkCompleteError = state => state.purchase.markCompletedError;
