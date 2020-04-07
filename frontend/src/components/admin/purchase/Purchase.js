import React, {useState} from 'react';

import PurchaseList from './PurchaseList'
import PurchaseDetail from './PurchaseDetail'
import { usePurchases } from '../hooks/usePurchases';

const Purchase = () => {
    const { purchases } = usePurchases();
    const [purchase, setPurchase] = useState(undefined);

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
