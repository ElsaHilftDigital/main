import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { volunteerActions, volunteerSelectors } from '../../../store/volunteer';


export const useVolunteerOpenPurchases = uuid => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(volunteerActions.getOpenPurchaseList(uuid));
    }, [dispatch, uuid])

    return {
        openPurchases: useSelector(volunteerSelectors.selectCurrentOpenPurchaseList),
        requestOngoing: useSelector(volunteerSelectors.selectGetOpenPurchaseListRequestOngoing),
        error: useSelector(volunteerSelectors.selectGetOpenPurchaseListError),
    };
};