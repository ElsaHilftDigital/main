import React from 'react';

const CustomerList = (props) => {
    if (!props.customers.length) {
        return <>Keine Kunden</>;
    }

    return (
        <>
            <span className="list-header mt-3 mb-2">Kunden</span>
            <ul className="sidebar-nav">
                {props.customers.map(customer => (
                    <li 
                        onClick={() => props.updateSelectedCustomer(customer.id)}
                        key={customer.id} 
                        className={'nav-item' + (customer.id === props.selectedCustomer.id ? ' nav-item-active' : '')}
                    >
                        {customer.name}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default CustomerList;