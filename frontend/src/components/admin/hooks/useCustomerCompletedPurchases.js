import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { customerActions, customerSelectors } from '../../../store/customer';


export const useCustomerCompletedPurchases = uuid => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(customerActions.getCompletedPurchaseList(uuid));
    }, [dispatch, uuid])

    return {
        completedPurchases: useSelector(customerSelectors.selectCurrentCompletedPurchaseList),
        requestOngoing: useSelector(customerSelectors.selectGetCompletedPurchaseListRequestOngoing),
        error: useSelector(customerSelectors.selectGetCompletedPurchaseListError),
    };
};