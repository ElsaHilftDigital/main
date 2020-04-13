import React from 'react';
import styled from 'styled-components';

const PurchaseListItem = styled.li`
    padding: 0.375rem 0.75rem !important;
`;

const SupermarketListItem = styled.li`
    padding: 0.375rem 0.75rem !important;
`;

const PurchaseList = (props) => {
    const { value, setValue } = props;

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
    const keyDownHandler = (e) => {
        if (e.key === "Enter") {
            const value = e.currentTarget.value;
            value && addToSupermarketList(
                {
                    name: value,
                    orderItems: [],
                }
            );
        }
    };

    return <ul className="list-group mb-3">
        {value.map((supermarket, index) => <SupermarketListItem className="list-group-item" key={index}>
            <i onClick={() => removeFromSupermarketList(index)} style={{ margin: 'auto' }} className="fa fa-trash float-right" />
            <SinglePurchaseList supermarket={supermarket} onUpdate={updateSupermarket(supermarket)} />
        </SupermarketListItem>)}
        <SupermarketListItem className="list-group-item">
            <input className="no-outline" type="text" onKeyDown={keyDownHandler} placeholder="Eingabe neuer Supermarkt"></input>
        </SupermarketListItem>
    </ul>
}

const SinglePurchaseList = (props) => {
    const { supermarket, onUpdate } = props;

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
                <i onClick={() => removeFromPurchaseList(index)} style={{ margin: 'auto' }} className="fa fa-trash float-right" />
            </PurchaseListItem>)}
            <PurchaseListItem className="list-group-item">
                <input className="no-outline" type="text" onKeyPress={keyPressHandler} autoFocus placeholder="Neues Einkaufsitem"></input>
            </PurchaseListItem>
        </ul>
    </>);
}

export default PurchaseList;