export const purchaseDetails = (purchaseId: string) => `/purchase/${purchaseId}`;
export const volunteerDetails = (volunteerId: string) => `/volunteer/${volunteerId}`;
export const customerDetails = (customerId: string) => `/customer/${customerId}`;
export const purchaseReceipt = (purchaseId: string) => `/api/v1/admin/purchases/${purchaseId}/receipt`;
export const purchaseExportAll = (startDate: Date, endDate: Date) => `/api/v1/admin/purchases/exports/${encodeURIComponent(startDate.toISOString().substring(0, 10))}/${encodeURIComponent(endDate.toISOString().substring(0, 10))}`;
export const purchaseExport = (purchaseId: string) => `/api/v1/admin/purchases/${purchaseId}/export`;
