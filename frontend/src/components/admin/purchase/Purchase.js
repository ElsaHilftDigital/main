import React from 'react';

import PurchaseList from './PurchaseList'
import PurchaseDetail from './PurchaseDetail'

const Purchase = () => {
    const currentPurchase = {
        status: "Neu",
        createDate: "5.4.2020",
        timing: "Bis 5.4.2020 17:00",
        supermarket: "Migros",
        purchaseSize: "Gross",
        paymentMethod: "Überweisung",
        comments: "Bitte absprechen mit Helfer",
        receipt: "Link zur Quittung",
        cost: "CHF 110.-",
        expensesOpen: 130,

        // von Kunde
        customerCity: "Baden",
        customerLastname: "Frozen",
        customerFirstname: "Elsa",

        // von Helfer
        volunteerLastname: "Melting",
        volunteerFirstname: "Anna",
        volunteerIsChosen: false
    }
    return (
        <div>
            <h1>Einkäufe</h1>
            <PurchaseList />
            <PurchaseDetail currentPurchase={currentPurchase}/>
        </div>
    );
};

export default Purchase;
