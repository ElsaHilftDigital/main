import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { customerActions, customerSelectors } from '../../../store/customer';


export const useCustomers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(customerActions.getAllCustomers());
    }, [dispatch])

    return {
        customers: useSelector(customerSelectors.selectCustomers),
        requestOngoing: useSelector(customerSelectors.selectGetCustomersRequestOngoing),
        error: useSelector(customerSelectors.selectGetCustomersError),
    }
};