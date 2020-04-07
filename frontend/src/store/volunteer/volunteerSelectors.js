export const selectVolunteers = state => state.volunteer.volunteers;
export const selectGetVolunteersRequestOngoing = state => state.volunteer.getVolunteersRequestOngoing;
export const selectGetVolunteersError = state => state.volunteer.getVolunteersError;

export const selectCurrentVolunteer = state => state.volunteer.currentVolunteer;
export const selectGetVolunteerRequestOngoing = state => state.volunteer.getVolunteerRequestOngoing;
export const selectGetVolunteerError = state => state.volunteer.getVolunteerError;

export const selectCreateVolunteerRequestOngoing = state => state.volunteer.createVolunteerRequestOngoing;
export const selectCreateVolunteerSuccess = state => state.volunteer.createVolunteerSuccess;
export const selectCreateVolunteerError = state => state.volunteer.createVolunteerError;

export const selectUpdateVolunteerRequestOngoing = state => state.volunteer.updateVolunteerRequestOngoing;
export const selectUpdateVolunteerError = state => state.volunteer.updateVolunteerError;

export const selectDeleteVolunteerRequestOngoing = state => state.volunteer.deleteVolunteerRequestOngoing;
export const selectDeleteVolunteerError = state => state.volunteer.deleteVolunteerError;

export const selectValidateVolunteerRequestOngoing = state => state.volunteer.validateVolunteerRequestOngoing;
export const selectValidateVolunteerError = state => state.volunteer.validateVolunteerError;

export const selectCurrentCompletedPurchaseList = state => state.volunteer.currentCompletedPurchaseList;
export const selectGetCompletedPurchaseListRequestOngoing = state => state.volunteer.getCompletedPurchaseListRequestOngoing;
export const selectGetCompletedPurchaseListError = state => state.volunteer.getCompletedPurchaseListError;

export const selectCurrentOpenPurchaseList = state => state.volunteer.currentOpenPurchaseList;
export const selectGetOpenPurchaseListRequestOngoing = state => state.volunteer.getOpenPurchaseListRequestOngoing;
export const selectGetOpenPurchaseListError = state => state.volunteer.getOpenPurchaseListError;

export const selectSelectedVolunteer = state => state.volunteer.selectedVolunteer;