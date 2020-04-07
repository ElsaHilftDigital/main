import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { customerActions, customerSelectors } from '../../../store/customer';


export const useCustomerOpenPurchases = uuid => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(customerActions.getOpenPurchaseList(uuid));
    }, [dispatch, uuid])

    return {
        openPurchases: useSelector(customerSelectors.selectCurrentOpenPurchaseList),
        requestOngoing: useSelector(customerSelectors.selectGetOpenPurchaseListRequestOngoing),
        error: useSelector(customerSelectors.selectGetOpenPurchaseListError),
    };
};