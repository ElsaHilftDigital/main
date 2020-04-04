import React from 'react';

import CustomerDetail from './CustomerDetail';
import CustomerList from './CustomerList';

const Customer = () => {
    return (
        <div>
            <CustomerList />
            <CustomerDetail />
        </div>
    );
};

export default Customer;