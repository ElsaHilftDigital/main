export const purchaseDetails = (purchaseId: string) => `/purchase/${purchaseId}`;
export const volunteerDetails = (volunteerId: string) => `/volunteer/${volunteerId}`;
export const customerDetails = (customerId: string) => `/customer/${customerId}`;
export const purchaseReceipt = (purchaseId: string) => `/api/v1/admin/purchases/${purchaseId}/receipt`;
export const purchaseExportAll = (startDate: Date, endDate: Date) => `/api/v1/admin/purchases/export/${startDate.toISOString()}/${endDate.toISOString()}`;
export const purchaseExport = (purchaseId: string) => `/api/v1/admin/purchases/${purchaseId}/export`;
