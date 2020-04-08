export const selectCustomers = state => state.customer.customers;
export const selectGetCustomersRequestOngoing = state => state.customer.getCustomersRequestOngoing;
export const selectGetCustomersError = state => state.customer.getCustomersError;

export const selectCurrentCustomer = state => state.customer.currentCustomer;
export const selectGetCustomerRequestOngoing = state => state.customer.getCustomerRequestOngoing;
export const selectGetCustomerError = state => state.customer.getCustomerError;

export const selectCurrentCompletedPurchaseList = state => state.customer.currentCompletedPurchaseList;
export const selectGetCompletedPurchaseListRequestOngoing = state => state.customer.getCompletedPurchaseListRequestOngoing;
export const selectGetCompletedPurchaseListError = state => state.customer.getCompletedPurchaseListError;

export const selectCurrentOpenPurchaseList = state => state.customer.currentOpenPurchaseList;
export const selectGetOpenPurchaseListRequestOngoing = state => state.customer.getOpenPurchaseListRequestOngoing;
export const selectGetOpenPurchaseListError = state => state.customer.getOpenPurchaseListError;
 
export const selectCreateCustomerRequestOngoing = state => state.customer.createCustomerRequestOngoing;
export const selectCreateCustomerSuccess = state => state.customer.createCustomerSuccess;
export const selectCreateCustomerError = state => state.customer.createCustomerSuccess;

export const selectUpdateCustomerRequestOngoing = state => state.customer.updateCustomerRequestOngoing;
export const selectUpdateCustomerError = state => state.updateCustomerError;

export const selectDeleteCustomerRequestOngoing = state => state.customer.deleteCustomerRequestOngoing;
export const selectDeleteCustomerError = state => state.customer.deleteCustomerError;

export const selectSelectedCustomer = state => state.customer.selectedCustomer;