import React, { useState } from 'react';

import { useCustomers } from 'hooks/useCustomers';
import CustomerDetail from './CustomerDetail';
import CustomerList from './CustomerList';

const Customer = () => {
    const { customers } = useCustomers();
    const [selectedCustomer, setSelectedCustomer] = useState(undefined);

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