import React from 'react';

import CustomerDetail from './CustomerDetail';
import CustomerList from './CustomerList';

const Customer = () => {
    const customers = [ { id: 1, name: 'test1' },
     { id: 2, name: 'test2' }, 
     { id: 3, name: 'test3' },
     { id: 4, name: 'test3' },
     { id: 5, name: 'test3' },
     { id: 6, name: 'test3' },
     { id: 7, name: 'test3' },
     { id: 8, name: 'test3' },
     { id: 9, name: 'test3' },
     { id: 10, name: 'test3' },
     { id: 11, name: 'test3' },
     { id: 12, name: 'test3' },
     { id: 13, name: 'test3' },
     { id: 14, name: 'test3' },
     { id: 15, name: 'test3' },
     { id: 19, name: 'test3' },
     { id: 110, name: 'test3' },
     { id: 111, name: 'test3' },
     { id: 112, name: 'test3' },
     { id: 113, name: 'test3' },
     { id: 114, name: 'test3' },
     { id: 115, name: 'test3' }];

     const customers2 = [ { id: 1, name: 'test1' },
     { id: 2, name: 'test2' }, 
     { id: 3, name: 'test3' }];
    const selectedCustomer = { id: 2, name: 'test2' };
    return (
        <div>
            <div className="sidebar">
                <CustomerList customers={customers} selectedCustomer={2} />
            </div>
            <div className="content">
                <CustomerDetail selectedCustomer={selectedCustomer} />
            </div>
        </div>
    );
};

export default Customer;