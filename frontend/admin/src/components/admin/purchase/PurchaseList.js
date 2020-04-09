import React from 'react';
import { useHistory } from 'react-router-dom';

import { useCustomers } from 'hooks/useCustomers';
import { usePurchases } from 'hooks/usePurchases';
import * as routes from 'routes';


const PurchaseList = props => {
    const {customers} = useCustomers();
    const {purchases} = usePurchases();
    const history = useHistory();

    if (!purchases?.length) {
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
                {purchases.map(purchase => {
                    const currentCustomer = customers.find(customer => customer.uuid === purchase.customer);
                    return (
                    <li 
                        onClick={() => history.push(routes.purchaseDetails(purchase.uuid))}
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
