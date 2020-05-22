import React, {useState} from 'react';
import styled from 'styled-components';

const PurchaseListItem = styled.li`
    padding: 0.375rem 0.75rem !important;
`;

const SupermarketListItem = styled.li`
    padding: 0.375rem 0.75rem !important;
`;

const PurchaseList = (props) => {
    const { value, setValue, autoFocus, enableSave } = props;

    const addToSupermarketList = supermarket => setValue(value.concat([supermarket]));
    const updateSupermarket = (supermarket) => (newSupermarket) => setValue(
        value.map(currentSupermarket => {
            if (currentSupermarket === supermarket) {
                return newSupermarket
            }
            else {
                return currentSupermarket
            }
        }
        ));
    const removeFromSupermarketList = index => setValue(value.filter((_, i) => i !== index));
    const keyPressHandler = (e) => {
        if (e.key === "Enter") {
            supermarket && addToSupermarketList(
                {
                    name: supermarket,
                    orderItems: [],
                }
            );
            setSupermarket('');
        }
    };

    const [supermarket, setSupermarket] = useState('');

    return <ul className="list-group mb-3">
        {value.map((supermarket, index) =>
        <SupermarketListItem className="list-group-item" key={index}>
            {enableSave &&
            <i onClick={() => removeFromSupermarketList(index)} style={{ margin: 'auto' }} className="fa fa-trash float-right" />}
            <SinglePurchaseList autoFocus={autoFocus} supermarket={supermarket} onUpdate={updateSupermarket(supermarket)} enableSave={enableSave}/>
        </SupermarketListItem>)}
        {enableSave &&
        <SupermarketListItem className="list-group-item">
            <input className="no-outline" type="text" value={supermarket} onChange={e => setSupermarket(e.target.value)} onKeyPress={keyPressHandler} placeholder="Eingabe neuer Supermarkt"/>
        </SupermarketListItem>}
    </ul>
}

const SinglePurchaseList = (props) => {
    const { supermarket, onUpdate, autoFocus, enableSave } = props;

    const addToPurchaseList = (item) => {
        onUpdate(
            Object.assign({}, supermarket, {
                orderItems: supermarket.orderItems.concat([item])
            })
        )
    };
    const removeFromPurchaseList = (index) => {
        onUpdate(
            Object.assign({}, supermarket, {
                orderItems: supermarket.orderItems.filter((_, i) => i !== index)
            })
        )
    }
    const keyPressHandler = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const value = e.currentTarget.value;
            value && addToPurchaseList(value);
            e.currentTarget.value = "";
        }
    };

    return (<>
        <label><b>Einkaufsliste für {supermarket.name}</b></label>
        <p>
            <i>Bitte jedes Produkt mit "Enter" bestätigen.</i>
        </p>
        <ul className="list-group mb-3">
            {supermarket.orderItems.map((item, index) => <PurchaseListItem className="list-group-item" key={index}>
                {item}
                {enableSave &&
                <i onClick={() => removeFromPurchaseList(index)} style={{ margin: 'auto' }} className="fa fa-trash float-right" />}
            </PurchaseListItem>)}
            {enableSave &&
            <PurchaseListItem className="list-group-item">
                <input className="no-outline" type="text" onKeyPress={keyPressHandler} autoFocus={autoFocus} placeholder="Neues Einkaufsitem"/>
            </PurchaseListItem>}
        </ul>
    </>);
}

export default PurchaseList;