import React, { useState } from 'react';
import { CreateCustomerRequest, Customer, useCustomers } from 'apis/customer';
import SearchBox from '../../../components/SearchBox';
import { useForm } from 'react-hook-form';
import { Button } from 'react-bootstrap';

interface Props {
    customer?: Customer | CreateCustomerRequest,
    setCustomer: (customer: any) => void;
}

interface WizardProps extends Props {
    next: () => void,
}

const CustomerStep: React.FC<Props> = props => {
    const { customer, setCustomer, next } = props as WizardProps;
    const [isNew, setIsNew] = useState(customer && !('uuid' in customer));
    const { customers } = useCustomers();

    return (<>
        <form className="mb-3">
            <div className="form-check form-check-inline">
                <input className="form-check-input" checked={!isNew} onChange={() => {
                    setIsNew(false);
                    setCustomer(undefined);
                }} type="radio" id="existing" name="customerType"/>
                <label className="form-check-label" htmlFor="existing">Bestehender Kunde</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" checked={isNew} onChange={() => {
                    setIsNew(true);
                    setCustomer(undefined);
                }} type="radio" id="new" name="customerType"/>
                <label className="form-check-label" htmlFor="new">Neuer Kunde</label>
            </div>
        </form>
        {isNew
            ? <NewCustomer customer={customer as CreateCustomerRequest}
                           setCustomer={setCustomer}
                           next={next}
            />
            : <ExistingCustomer customer={customer as Customer}
                                setCustomer={setCustomer}
                                allCustomers={customers}
                                next={next}/>}
    </>);
};

export default CustomerStep;

interface NewCustomerProps {
    customer: CreateCustomerRequest,
    setCustomer: (customer: any) => void,
    next: () => void,
}

const NewCustomer: React.FC<NewCustomerProps> = props => {
    const { errors, handleSubmit, register } = useForm({
        defaultValues: props.customer ?? {},
    });
    const onSubmit = (data: any) => {
        props.setCustomer(data);
        props.next();
    };

    return <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
            <div className="form-group col-md-6">
                <label htmlFor="firstName">Vorname</label>
                <input name="firstName" type="text" ref={register({ required: true })} className="form-control"
                       id="firstName" placeholder="Vorname"/>
                {errors.firstName && (<span className="text-danger">Vorname wird benötigt</span>)}
            </div>
            <div className="form-group col-md-6">
                <label htmlFor="lastName">Nachname</label>
                <input name="lastName" type="text" ref={register({ required: true })} className="form-control"
                       id="lastName" placeholder="Nachname"/>
                {errors.lastName && (<span className="text-danger">Nachname wird benötigt</span>)}
            </div>
        </div>
        <div className="form-group">
            <label htmlFor="address">Adresse</label>
            <input name="address" type="text" ref={register({ required: true })} className="form-control"
                   id="address" placeholder="Adresse"/>
            {errors.address && (<span className="text-danger">Adresse wird benötigt</span>)}
        </div>
        <div className="row">
            <div className="form-group col-md-6">
                <label htmlFor="zipCode">PLZ</label>
                <input name="zipCode" type="text" ref={register()} className="form-control"
                       id="zipCode" placeholder="PLZ"/>
            </div>
            <div className="form-group col-md-6">
                <label htmlFor="city">Ort</label>
                <input name="city" type="text" ref={register({ required: true })} className="form-control"
                       id="city" placeholder="Ort"/>
                {errors.city && (<span className="text-danger">Ort wird benötigt</span>)}
            </div>
        </div>
        <div className="row">
            <div className="form-group col-md-6">
                <label htmlFor="phone">Telefonnummer</label>
                <input name="phone" type="text" ref={register({ required: true })} className="form-control"
                       id="phone" placeholder="Telefonnummer"/>
                {errors.phone && (<span className="text-danger">Telefonnummer wird benötigt</span>)}
            </div>
            <div className="form-group col-md-6">
                <label htmlFor="mobile">Notfallnummer</label>
                <input name="mobile" type="text" ref={register()} className="form-control" id="mobile"
                       placeholder="Notfallnummer"/>
            </div>
        </div>
        <Button type="submit" className="float-right">Weiter</Button>
    </form>;
};

interface ExistingCustomerProps {
    allCustomers: Customer[],
    customer?: Customer,
    setCustomer: (customer: Customer) => void,
    next: () => void,
}

const ExistingCustomer: React.FC<ExistingCustomerProps> = props => {
    const renderCustomerSuggestion = (customer: Customer) => {
        return [
            <div key="name">{customer.firstName} {customer.lastName}</div>,
            <div key="address">{customer.address}</div>,
            <div key="address2">{customer.zipCode} {customer.city}</div>,
            <div key="phone">{customer.phone}{customer.mobile && ` / ${customer.mobile}`}</div>,
        ];
    };

    const searchTerms = (rawInput: string) => {
        const rawTerms = rawInput.trim().split(/\s+/);
        let terms = [];
        let isNumber = false;
        let numberTerm = undefined;
        for (let i = 0; i < rawTerms.length; i++) {
            const term = rawTerms[i].toLowerCase();
            if (!isNaN(Number(term))) {
                if (isNumber) {
                    numberTerm += term;
                } else {
                    isNumber = true;
                    numberTerm = term;
                }
            } else {
                if (isNumber) {
                    isNumber = false;
                    terms.push(numberTerm);
                    terms.push(term);
                } else {
                    terms.push(term);
                }
            }
        }
        if (isNumber) {
            terms.push(numberTerm);
        }
        return terms;
    };
    const matches = (customer: Customer, searchText: string) => {
        const terms = searchTerms(searchText);
        const { uuid, ...remainder } = customer;
        const properties = Object.values(remainder).map((s: any) => s.toLowerCase());
        return terms.every(term => properties.some(prop => prop.includes(term)));
    };
    return <>
        <SearchBox
            items={props.allCustomers}
            onChange={props.setCustomer}
            filter={matches}
            renderItem={renderCustomerSuggestion}/>
        {props.customer && <>
            <div className="row mt-3">
                <div className="form-group col-md-6">
                    <label htmlFor="firstName">Vorname</label>
                    <input disabled name="firstName" type="text" className="form-control" id="firstName"
                           value={props.customer.firstName}/>
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="lastName">Nachname</label>
                    <input disabled name="lastName" type="text" className="form-control" id="lastName"
                           value={props.customer.lastName}/>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="address">Adresse</label>
                <input disabled name="address" type="text" className="form-control" id="address"
                       value={props.customer.address}/>
            </div>
            <div className="row">
                <div className="form-group col-md-6">
                    <label htmlFor="zipCode">PLZ</label>
                    <input disabled name="zipCode" type="text" className="form-control" id="zipCode"
                           value={props.customer.zipCode}/>
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="city">Ort</label>
                    <input disabled name="city" type="text" className="form-control" id="city"
                           value={props.customer.city}/>
                </div>
            </div>
            <div className="row">
                <div className="form-group col-md-6">
                    <label htmlFor="phone">Telefonnummer</label>
                    <input disabled name="phone" type="text" className="form-control" id="phone"
                           value={props.customer.phone}/>
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="mobile">Notfallnummer</label>
                    <input disabled name="mobile" type="text" className="form-control" id="mobile"
                           value={props.customer.mobile}/>
                </div>
            </div>
        </>}
        <Button onClick={props.next}
                type="submit"
                disabled={!props.customer || !props.customer.uuid}
                className="mt-3 mb-3 float-right">Weiter</Button>
    </>;
};