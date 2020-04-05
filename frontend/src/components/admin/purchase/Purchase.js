import React, {useState} from 'react';
import { useSelector } from 'react-redux';

import PurchaseList from './PurchaseList'
import PurchaseDetail from './PurchaseDetail'
import { usePurchases } from '../usePurchases';

const Purchase = () => {
    const purchases = usePurchases();
    const [purchase, setPurchase] = useState(undefined);

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
            <div className="sidebar">
                <PurchaseList
                        purchases={purchases}
                        updateSelectedPurchase={setPurchase}
                        selectedPurchase={purchase}/>
            </div>
            <div className="content">
                {purchase && <PurchaseDetail currentPurchase={purchase}/>}
            </div>
        </div>
    );
};

export default Purchase;
