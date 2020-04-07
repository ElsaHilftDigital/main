import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { volunteerActions, volunteerSelectors } from '../../../store/volunteer';


export const useVolunteerCompletedPurchases = uuid => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(volunteerActions.getCompletedPurchaseList(uuid));
    }, [dispatch, uuid])

    return {
        completedPurchases: useSelector(volunteerSelectors.selectCurrentCompletedPurchaseList),
        requestOngoing: useSelector(volunteerSelectors.selectGetCompletedPurchaseListRequestOngoing),
        error: useSelector(volunteerSelectors.selectGetCompletedPurchaseListError),
    };
};