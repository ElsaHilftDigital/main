import React from 'react';
import {useCustomers} from '../hooks/useCustomers';


const PurchaseList = props => {
    const {customers} = useCustomers();

    if (!props.purchases.length) {
        return (
            <span>
                <span className="list-header mt-3 mb-2">Einkäufe</span>
                <ul className="sidebar-nav">
                    Keine Einkäufe
                </ul>
            </span>
        );
    };

    return (
        <>
            <span className="list-header mt-3 mb-2">Einkäufe</span>
            <ul className="sidebar-nav">
                {props.purchases.map(purchase => {
                    console.log(customers);
                    const currentCustomer = customers.find(customer => customer.uuid === purchase.customer);
                    
                    console.log(purchase)

                    return (
                    <li 
                        onClick={() => props.updateSelectedPurchase(purchase)}
                        key={purchase.uuid} 
                        className={'nav-item' + (purchase.uuid === props.selectedPurchase?.uuid ? ' nav-item-active' : '')}
                    >
                        {
                            <div className="d-flex flex-column">
                                <b>{currentCustomer ? currentCustomer.lastName : "Error"}</b>
                                <i><b>{purchase.status}</b></i>
                            </div>
                        }
                    </li>
                )})}
            </ul>
        </>);
    };

export default PurchaseList;
