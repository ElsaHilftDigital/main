import { Moment } from "moment";

export const purchaseList = () => `/purchase`;
export const purchaseDetails = (purchaseId: string) => `/purchase/${purchaseId}`;
export const volunteerDetails = (volunteerId: string) => `/volunteer/${volunteerId}`;
export const customerDetails = (customerId: string) => `/customer/${customerId}`;
export const purchaseReceipt = (purchaseId: string) => `/api/v1/admin/purchases/${purchaseId}/receipt`;
export const purchaseExport = (purchaseId: string) => `/api/v1/admin/purchases/${purchaseId}/export`;
export const purchaseExportAll = (startDate: Moment, endDate: Moment) => `/api/v1/admin/purchases/exports/${encodeURIComponent(startDate.format('YYYY-MM-DD'))}/${encodeURIComponent(endDate.format('YYYY-MM-DD'))}`;
export const receiptExport = (startDate: Moment, endDate: Moment) => {
    const params = new URLSearchParams();
    params.append('from', startDate.format('YYYY-MM-DD'));
    params.append('to', endDate.format('YYYY-MM-DD'));
    return `/api/v1/admin/export/receipts?${params.toString()}`;
}
