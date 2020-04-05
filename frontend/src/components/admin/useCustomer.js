import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { customerActions, customerSelectors } from '../../store/customer';


export const useCustomer = (uuid) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(customerActions.getCustomer(uuid));
    }, [dispatch, uuid])

    return useSelector(customerSelectors.getCustomer);
};
