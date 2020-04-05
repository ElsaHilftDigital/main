import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {useForm} from 'react-hook-form';
import {useSelector, useDispatch} from 'react-redux';

import SearchBox from '../../SearchBox';
import {useCustomers} from '../useCustomers';
import {customerSelectors, customerActions} from '../../../store/customer';
import {purchaseSelectors, purchaseActions} from '../../../store/purchase';

const ProgressItem = styled.li`
    position: relative;
    display: table-cell;
    text-align: center;
    font-weight: ${props => props.isActive ? 'bold' : 'normal'};
        
    &:before {
        content: '';
        display: block;
        margin: 0 auto;
        background: ${props => (props.isActive || props.isCompleted) ? '#2f2f86' : '#6c757d' };
        width: 1em;
        height: 1em;
        margin-bottom: 1em;
        line-height: 4em;
        border-radius: 100%;
        position: relative;
        z-index: 1000;
    }
    &:after {
        content: '';
        position: absolute;
        display: block;
        background: ${props => props.isCompleted ? '#2f2f86' : '#6c757d'};
        width: 100%;
        height: 0.25em;
        top: 0.375em;
        left: 50%;
        margin-left: 0.5em;
        z-index: -1;
        color: white;
    }
    &:last-child:after {
        display: none;
    }
`;

const Progress = styled.ol`
    list-style: none;
    margin: 4rem 0 2rem;
    padding: 0;
    display: table;
    table-layout: fixed;
    width: 100%;
`;

const NewRequest = () => {
    const steps = ['Kunde', 'Auftrag', 'Bestätigung'];
    const [step, setStep] = useState(0);
    const [customer, setCustomer] = useState(undefined);
    const [newCustomer, setNewCustomer] = useState(false);
    const [purchaseList, setPurchaseList] = useState([]);
    const [purchase, setPurchase] = useState(undefined);

    const renderSteps = () => steps.map((s, i) => (
        <ProgressItem key={i} isActive={i === step} isCompleted={i < step}>
            <span>{s}</span>
        </ProgressItem>
    ));

    const EnterCustomer = () => {
        const allCustomers = useCustomers();

        const ExistingCustomer = () => {
            return <>
                <SearchBox
                        items={allCustomers}
                        loading={customerSelectors.getAllCustomersRequestOngoing}/>
                <form className="mt-3" onSubmit={() => setStep(step + 1)}>
                    <button type="submit" disabled={!customer || !customer.id} className="btn btn-primary float-right">Weiter</button>
                </form>
            </>;
        };

        const NewCustomer = () => {
            const { errors, handleSubmit, register } = useForm({
                defaultValues: customer ?? {}
            });
            const onSubmit = data => {
                setCustomer(data);
                setStep(step + 1);
            }

            return <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="firstName">Vorname</label>
                        <input name="firstName" type="text" ref={register({ required: true })} className="form-control" id="firstName" placeholder="Vorname"/>
                        {errors.firstname && (<span className="text-danger">Vorname wird benötigt</span>)}
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="lastName">Nachname</label>
                        <input name="lastName" type="text" ref={register({ required: true })} className="form-control" id="lastName" placeholder="Nachname"/>
                        {errors.lastname && (<span className="text-danger">Nachname wird benötigt</span>)}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="address">Adresse</label>
                    <input name="address" type="text" ref={register({ required: true })} className="form-control" id="address" placeholder="Adresse"/>
                        {errors.address && (<span className="text-danger">Adresse wird benötigt</span>)}
                </div>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="zipCode">PLZ</label>
                        <input name="zipCode" type="text" ref={register({ required: true })} className="form-control" id="zipCode" placeholder="PLZ"/>
                        {errors.zipCode && (<span className="text-danger">PLZ wird benötigt</span>)}
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="city">Ort</label>
                        <input name="city" type="text" ref={register({ required: true })} className="form-control" id="city" placeholder="Ort"/>
                        {errors.city && (<span className="text-danger">Ort wird benötigt</span>)}
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="phone">Festnetz</label>
                        <input name="phone" type="text" ref={register({ required: true })} className="form-control" id="phone" placeholder="Festnetz"/>
                        {errors.phone && (<span className="text-danger">Festnetz wird benötigt</span>)}
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="mobile">Mobile</label>
                        <input name="mobile" type="text" ref={register({ required: true })} className="form-control" id="mobile" placeholder="Mobile"/>
                        {errors.mobile && (<span className="text-danger">Mobile wird benötigt</span>)}
                    </div>
                </div>
                <button type="submit" className="btn btn-primary float-right">Weiter</button>
            </form>;
        };

        return (<>
            <form className="mb-3">
                <div className="form-check form-check-inline">
                    <input className="form-check-input" checked={!newCustomer} onChange={() => setNewCustomer(false)} type="radio" id="existing" name="customerType"/>
                    <label className="form-check-label" for="existing">Bestehender Kunde</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" checked={newCustomer} onChange={() => setNewCustomer(true)} type="radio" id="new" name="customerType"/>
                    <label className="form-check-label" for="new">Neuer Kunde</label>
                </div>
            </form>
            {newCustomer ? <NewCustomer/> : <ExistingCustomer/> }
        </>);
    };

    const EnterPurchase = () => {
        const { handleSubmit, register } = useForm({
            defaultValues: purchase ?? {}
        });
        const addToPurchaseList = item => setPurchaseList(purchaseList.concat([item]));
        const removeFromPurchaseList = index => setPurchaseList(purchaseList.filter((_, i) => i !== index));
        const keyDownHandler = (e) => {
            if (e.key === "Enter") {
                const value = e.currentTarget.value;
                value && addToPurchaseList(value);
            }
        };

        const Li = styled.li`
            padding: 0.375rem 0.75rem !important;
        `;

        const onReset = data => {
            setPurchase(data);
            setStep(step - 1);
        };

        const onSubmit = data => {
            setPurchase(data)
            setStep(step + 1);
        };

        return (<>
            <label>Einkaufsliste</label>
            <ul className="list-group mb-3">
                {purchaseList.map((item, index) => <Li className="list-group-item" key={index}>
                    {item}
                    <i onClick={() => removeFromPurchaseList(index)} style={{margin: 'auto'}} className="fa fa-trash float-right"/>
                </Li>)}
                <Li className="list-group-item">
                    <input className="border-0" type="text" onKeyDown={keyDownHandler} autoFocus></input>
                </Li>
            </ul>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="supermarket">Geschäft</label>
                    <input name="supermarket" id="supermarket" type="text" ref={register} className="form-control" placeholder="Geschäft"/>
                </div>
                <div className="form-group">
                    <label htmlFor="purchaseSize">Grösse des Einkaufs</label>
                    <select ref={register} id="purchaseSize" name="purchaseSize" className="form-control">
                        <option value="SMALL">Kleiner Einkauf</option>
                        <option value="MEDIUM">Mittlerer Einkauf</option>
                        <option value="LARGE">Grosser Einkauf</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="paymentMethod">Bezahlmethode</label>
                    <select ref={register} id="paymentMethod" name="paymentMethod" className="form-control">
                        <option value="CASH">Bargeld</option>
                        <option value="BILL">Rechnung</option>
                        <option value="OTHER">Andere</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="timing">Braucht Einkauf bis</label>
                    <input name="timing" id="timing" type="text" ref={register} className="form-control" placeholder="Braucht Einkauf bis"/>
                </div>
                <div className="form-group">
                    <label htmlFor="comments">Bemerkungen</label>
                    <input name="comments" type="text" ref={register} className="form-control" id="comments" placeholder="Bemerkungen"/>
                </div>

                <button type="button" onClick={handleSubmit(onReset)} className="btn btn-primary float-left">Zurück</button>
                <button type="submit" className="btn btn-primary float-right">Absenden</button>
            </form>
        </>);
    };

    const SubmitPurchase = () => {
        const dispatch = useDispatch();
        const ongoingCustomerCreate = useSelector(customerSelectors.createCustomerRequestOngoing);
        const customerSuccess = useSelector(customerSelectors.createCustomerSuccess);
        useEffect(() => {dispatch(customerActions.createCustomer(customer))}, [dispatch]);
        const ongoingPurchaseCreate = useSelector(purchaseSelectors.createPurchaseRequestOngoing);
        const createPurchaseSuccess = useSelector(purchaseSelectors.createPurchaseSuccess);
        useEffect(() => {customerSuccess && dispatch(purchaseActions.createPurchase(
            Object.assign(
                purchase,
                {
                    orderItems: purchaseList,
                    customer: customerSuccess.uuid
                }
            )
        ))}, [customerSuccess, dispatch]);
        return <>
            {ongoingCustomerCreate ? <span>Kunde wird erzeugt...</span> : 
                    customerSuccess
                    ? <span>Kunde wurde erzeugt</span> 
                    : <span>Fehler beim Erzeugen des Kunden</span>}
            {ongoingPurchaseCreate ? <span>Auftrag wird erzeugt...</span> :
                    createPurchaseSuccess
                    ? <span>Auftrag wurde erzeugt</span>
                    : <span>Fehler beim Erzeugen des Aufrags</span>}
        </>;
    };

    const renderContent = () => {
        switch (step) {
            case 0:
                return <EnterCustomer/>;
            case 1:
                return <EnterPurchase/>;
            case 2:
                return <SubmitPurchase/>;
        }
    };
    return (
        <div className="container mt-3 mb-5">
            <h1>Auftrag erfassen</h1>
            <Progress>{renderSteps()}</Progress>
            {renderContent()}
        </div>
    );
};

export default NewRequest;