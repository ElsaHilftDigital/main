import React from 'react';

const CustomerList = (props) => {
    if (!props.customers.length) {
        return (
            <span>
                <span className="list-header mt-3 mb-2">Kunden</span>
                <ul className="sidebar-nav">
                    Keine Kunden
                </ul>
            </span>
        );
    };

    return (
        <>
            <span className="list-header mt-3 mb-2">Kunden</span>
            <ul className="sidebar-nav">
                {props.customers.map(customer => (
                    <li 
                        onClick={() => props.updateSelectedCustomer(customer)}
                        key={customer.uuid} 
                        className={'nav-item' + (customer.uuid === props.selectedCustomer?.uuid ? ' nav-item-active' : '')}
                    >
                        {customer.lastName}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default CustomerList;
