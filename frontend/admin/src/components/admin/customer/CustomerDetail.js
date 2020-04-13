import React from 'react';
import { useForm } from 'react-hook-form';

import { customerActions } from 'store/customer';
import { useDispatch } from 'react-redux';


const CustomerDetail = (props) => {
    const dispatch = useDispatch();
    const { selectedCustomer } = props;
    const { handleSubmit, register } = useForm({
        defaultValues: {
            firstName: selectedCustomer.firstName,
            lastName: selectedCustomer.lastName,
            phone: selectedCustomer.phone,
            mobile: selectedCustomer.mobile,
            address: selectedCustomer.address,
            zipCode: selectedCustomer.zipCode,
            city: selectedCustomer.city,
            paymentMethod: 'bar',
            finishedJobs: 'none',
            openJobs: 'test',
            openPaymentAmount: '0',
            shoppingList: 'ravioli',
        },
    });

    const onSubmit = values => {
        dispatch(customerActions.updateCustomer(selectedCustomer.uuid, values));
    }

    if (!props.selectedCustomer) {
        return null;
    }

    return (
        <div className="container mb-5">
            <h2 className="mb-3">Details für Kunde {props.selectedCustomer.lastName}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="form-group row">
                            <label htmlFor="firstName" className="col-sm-3 col-form-label">Vorname</label>
                            <div className="col-sm-9">
                                <input name="firstName" ref={register()} type="text" className="form-control" id="firstName" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="lastName" className="col-sm-3 col-form-label">Nachname</label>
                            <div className="col-sm-9">
                                <input name="lastName" ref={register()} type="text" className="form-control" id="lastName" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="phone" className="col-sm-3 col-form-label">Telefonnummer</label>
                            <div className="col-sm-9">
                                <input name="phone" ref={register()} type="text" className="form-control" id="phone" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="mobile" className="col-sm-3 col-form-label">Mobile</label>
                            <div className="col-sm-9">
                                <input name="mobile" ref={register()} type="text" className="form-control" id="mobile" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="address" className="col-sm-3 col-form-label">Strasse</label>
                            <div className="col-sm-9">
                                <input name="address" ref={register()} type="text" className="form-control" id="addressStreet" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="zipCode" className="col-sm-3 col-form-label">PLZ</label>
                            <div className="col-sm-9">
                                <input name="zipCode" ref={register()} type="text" className="form-control" id="addressZipCode" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="city" className="col-sm-3 col-form-label">Ort</label>
                            <div className="col-sm-9">
                                <input name="city" ref={register()} type="text" className="form-control" id="addressCity" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                    <div className="form-group row">
                            <label htmlFor="paymentMethod" className="col-sm-4 col-form-label">Zahlungsmittel</label>
                            <div className="col-sm-8">
                                <input name="paymentMethod" ref={register()} type="text" className="form-control" id="paymentMethod" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="finishedJobs" className="col-sm-4 col-form-label">Abgeschlossene Anfragen</label>
                            <div className="col-sm-8">
                                <input name="finishedJobs" ref={register()} type="text" className="form-control" id="finishedJobs" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="openJobs" className="col-sm-4 col-form-label">Offene Anfragen</label>
                            <div className="col-sm-8">
                                <input name="openJobs" ref={register()} type="text" className="form-control" id="openJobs" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="openPaymentAmount" className="col-sm-4 col-form-label">Offener Betrag</label>
                            <div className="col-sm-8">
                                <input name="openPaymentAmount" ref={register()} type="text" className="form-control" id="openPaymentAmount" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="shoppingList" className="col-sm-4 col-form-label">Einkaufsliste</label>
                            <div className="col-sm-8">
                                <input name="shoppingList" ref={register()} type="text" className="form-control" id="shoppingList" />
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Speichern</button>
            </form>
        </div>
    );
};

export default CustomerDetail;