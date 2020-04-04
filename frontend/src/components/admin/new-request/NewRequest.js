import React, { useState } from 'react';
import styled from 'styled-components';

import SearchBox from '../../SearchBox';

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
    const steps = ['Kunde', 'Auftrag'];
    const [step, setStep] = useState(0);
    const renderSteps = () => steps.map((s, i) => (
        <ProgressItem key={i} isActive={i === step} isCompleted={i < step}>
            <span>{s}</span>
        </ProgressItem>
    ));

    const EnterCustomer = () => {
        const [newCustomer, setNewCustomer] = useState(false);

        return (<>
            <form>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" onChange={() => setNewCustomer(false)} type="radio" id="existing" name="customerType"/>
                    <label className="form-check-label" for="existing">Bestehender Kunde</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" onChange={() => setNewCustomer(true)} type="radio" id="new" name="customerType"/>
                    <label className="form-check-label" for="new">Neuer Kunde</label>
                </div>
            </form>
            {newCustomer ? <></> : <SearchBox/> }
            <form onSubmit={() => setStep(step + 1)}>
                <button type="submit" className="btn btn-primary float-right">Weiter</button>
            </form>
        </>);
    };

    const EnterPurchase = () => {
        return (<>
            <form onReset={() => setStep(step - 1)}>
                <button type="reset" className="btn btn-primary float-left">Zurück</button>
                <button type="submit" className="btn btn-primary float-right">Absenden</button>
            </form>
        </>);
    };


    const renderContent = () => {
        switch (step) {
            case 0:
                return <EnterCustomer/>;
            case 1:
                return <EnterPurchase/>;
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