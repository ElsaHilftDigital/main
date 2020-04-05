import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { customerActions, customerSelectors } from '../../../store/customer';
import { useCustomers } from '../useCustomers';
import CustomerDetail from './CustomerDetail';
import CustomerList from './CustomerList';

const Customer = () => {
    const dispatch = useDispatch();

    const customers = useCustomers();
    const selectedCustomer = useSelector(customerSelectors.getSelectedCustomer);

    const setSelectedCustomer = (uuid) => {
        dispatch(customerActions.setSelectedCustomer(uuid));
    };
    
    return (
        <div>
            <div className="sidebar">
                <CustomerList 
                    customers={customers} 
                    selectedCustomer={selectedCustomer} 
                    updateSelectedCustomer={setSelectedCustomer}
                />
            </div>
            <div className="content">
                {selectedCustomer && (
                    <CustomerDetail
                        selectedCustomer={selectedCustomer} 
                    />
                )}
            </div>
        </div>
    );
};

export default Customer;