export const selectCustomers = state => state.customer.customers;
export const selectGetCustomersRequestOngoing = state => state.customer.getCustomersRequestOngoing;
export const selectGetCustomersError = state => state.customer.getCustomersError;

export const selectCurrentCustomer = state => state.customer.currentCustomer;
export const selectGetCustomerRequestOngoing = state => state.customer.getCustomerRequestOngoing;
export const selectGetCustomerError = state => state.customer.getCustomerError;

export const selectCreateCustomerRequestOngoing = state => state.customer.createCustomerRequestOngoing;
export const selectCreateCustomerSuccess = state => state.customer.createCustomerSuccess;
export const selectCreateCustomerError = state => state.customer.createCustomerSuccess;

export const selectUpdateCustomerRequestOngoing = state => state.customer.updateCustomerRequestOngoing;
export const selectUpdateCustomerError = state => state.updateCustomerError;

export const selectDeleteCustomerRequestOngoing = state => state.customer.deleteCustomerRequestOngoing;
export const selectDeleteCustomerError = state => state.customer.deleteCustomerError;