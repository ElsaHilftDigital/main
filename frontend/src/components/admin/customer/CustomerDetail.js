import React from 'react';
import { useForm } from 'react-hook-form';

const CustomerDetail = (props) => {
    const { handleSubmit, register } = useForm();

    const onSubmit = values => {
        console.log(values);
    }

    return (
        <div className="container mb-5">
            <h2>Details für Kunde {props.selectedCustomer.name}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-6">
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
                            <label htmlFor="phoneNumber" className="col-sm-3 col-form-label">Telefonnummer</label>
                            <div className="col-sm-9">
                                <input name="phoneNumber" ref={register()} type="text" className="form-control" id="phoneNumber" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="city" className="col-sm-3 col-form-label">PLZ, Ort</label>
                            <div className="col-sm-9">
                                <input name="city" ref={register()} type="text" className="form-control" id="city" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="street" className="col-sm-3 col-form-label">Strasse</label>
                            <div className="col-sm-9">
                                <input name="street" ref={register()} type="text" className="form-control" id="street" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
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
                            <label htmlFor="phoneNumber" className="col-sm-3 col-form-label">Telefonnummer</label>
                            <div className="col-sm-9">
                                <input name="phoneNumber" ref={register()} type="text" className="form-control" id="phoneNumber" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="city" className="col-sm-3 col-form-label">PLZ, Ort</label>
                            <div className="col-sm-9">
                                <input name="city" ref={register()} type="text" className="form-control" id="city" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="street" className="col-sm-3 col-form-label">Strasse</label>
                            <div className="col-sm-9">
                                <input name="street" ref={register()} type="text" className="form-control" id="street" />
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