import React from 'react';

const PurchaseList = props => {
    if (!props.purchases.length) {
        return <>Keine Einkäufe</>;
    }

    return (
        <>
            <span className="list-header mt-3 mb-2">Einkäufe</span>
            <ul className="sidebar-nav">
                {props.purchases.map(purchase => (
                    <li 
                        onClick={() => props.updateSelectedPurchase(purchase)}
                        key={purchase.uuid} 
                        className={'nav-item' + (purchase.uuid === props.selectedPurchase?.uuid ? ' nav-item-active' : '')}
                    >
                        {purchase.uuid}
                    </li>
                ))}
            </ul>
        </>);
    };

export default PurchaseList;
