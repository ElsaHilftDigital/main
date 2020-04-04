import React from 'react';

const CustomerList = (props) => {
    if (!props.customers.length) {
        return <>Keine Kunden</>;
    }

    return (
        <>
            <span className="list-header mt-3 mb-3">Kunden</span>
            <ul className="sidebar-nav">
                {props.customers.map(customer => (
                    <li key={customer.id} className="nav-link">
                        {customer.name}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default CustomerList;