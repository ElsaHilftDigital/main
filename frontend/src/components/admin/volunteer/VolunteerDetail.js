import React from 'react';
import { useForm } from 'react-hook-form';

const VolunteerDetail = (props) => {
    const { currentVolunteer } = props;

    const {register, handleSubmit, errors, setValue } = useForm({defaultValues: {
        ...currentVolunteer,
        wantsNoCompensation: !currentVolunteer.wantsCompensation,
    }});

    setValue('firstName', currentVolunteer.firstName);
    setValue('lastName', currentVolunteer.lastName);
    setValue('phone', currentVolunteer.phone);
    setValue('email', currentVolunteer.mobile);
    setValue('address', currentVolunteer.address);
    setValue('zipCode', currentVolunteer.zipCode);
    setValue('city', currentVolunteer.city);
    setValue('birthdate', currentVolunteer.birthdate);
    setValue('wantsNoCompensation', !currentVolunteer.wantsCompensation);
    setValue('iban', currentVolunteer.iban);
    setValue('bankName', currentVolunteer.bankName);
    setValue('amountPurchases', currentVolunteer.amountPurchases);

    return (
        <div className="container mt-3 mb-5">
            <div className="d-flex justify-content-between align-items-bottom">
                <h1>Helfer {props.currentVolunteer.firstname}</h1>
                {!currentVolunteer.validated && (
                    <button 
                        onClick={() => props.onConfirmVolunteer(currentVolunteer.uuid)} 
                        className="btn btn-primary">Helfer bestätigen</button>
                    )}
            </div>
            <i>Die Felder von Helfern können von Moderatoren angepasst und gespeichert werden.</i>

            <form onSubmit={handleSubmit(props.onSubmit)} style={{paddingTop: "1em"}}>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="firstName">Vorname</label>
                        <input name="firstName" ref={register({ required: true })} type="text" className="form-control" id="firstName" placeholder="Vorname" />
                        {errors.firstName && (<span className="text-danger">Vorname wird benötigt</span>)}
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="lastName">Name</label>
                        <input name="lastName" ref={register({ required: true })} type="text" className="form-control" id="lastName" placeholder="Name" />
                        {errors.lastName && (<span className="text-danger">Name wird benötigt</span>)}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Telefonnummer</label>
                    <input name="phone" ref={register({ required: true })} type="tel" className="form-control" id="phone" placeholder="+41781234567" />
                    {errors.phone && (<span className="text-danger">Telefonnummer wird benötigt</span>)}
                </div>
                <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input name="email" ref={register({ required: true })} type="email" className="form-control" id="email" placeholder="elsa@baden.ch" />
                    {errors.email && (<span className="text-danger">E-mail wird benötigt</span>)}
                </div>
                <div className="form-group">
                    <label htmlFor="address">Strasse, Nr.</label>
                    <input name="address" ref={register({ required: true })} type="text" className="form-control" id="address" placeholder="Hauptrasse 1" />
                    {errors.address && (<span className="text-danger">Addresse wird benötigt</span>)}
                </div>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="zipCode">PLZ</label>
                        <input name="zipCode" ref={register({ required: true })} type="text" className="form-control" id="zipCode" placeholder="8000" />
                        {errors.zipCode && (<span className="text-danger">PLZ wird benötigt</span>)}
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="city">Ort</label>
                        <input name="city" ref={register({ required: true })} type="text" className="form-control" id="city" placeholder="Zürich" />
                        {errors.city && (<span className="text-danger">Ort wird benötigt</span>)}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="birthdate">Geburtstag <small>(DD/MM/YYYY)</small></label>
                    <input name="birthdate" ref={register({ required: true })} type="text" className="form-control" id="birthdate" />
                </div>
                <div className="form-check mb-2">
                    <input name="wantsNoCompensation" ref={register()} type="checkbox" className="form-check-input" id="wantsNoCompensation" />
                    <label className="form-check-label" htmlFor="wantsNoCompensation">Ich möchte keine Entschädigung für meinen Einsatz</label>
                </div>
                <div className="form-group">
                    <label htmlFor="iban">IBAN</label>
                    <input name="iban" ref={register({ required: true })} type="text" className="form-control" id="iban" />
                    {errors.iban && (<span className="text-danger">IBAN wird benötigt</span>)}
                </div>
                <div className="form-group">
                    <label htmlFor="bankName">Bank Name</label>
                    <input name="bankName" ref={register({ required: true })} type="text" className="form-control" id="bankName" />
                    {errors.bankName && (<span className="text-danger">Bank Name wird benötigt</span>)}
                </div>
                <div className="form-group">
                    <label htmlFor="amountPurchases">Anzahl Einkäufe</label>
                    <input name="amountPurchases" ref={register({ required: true })} type="text" className="form-control" id="amountPurchases" disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="displayTablePurchases">Erledigte Einkäufe</label>
                    <table className="table table-striped">
                        <tr>
                            <th>Kundenname</th>
                            <th>Gemeinde</th>
                            <th>Datum</th>
                        </tr>
                        <tr>
                            <td>Frozen</td>
                            <td>Baden</td>
                            <td>03.04.2020</td>
                        </tr>
                    </table>
                </div>
                <button type="submit" className="btn btn-primary">Speichern</button>
            </form>
        </div>
    );
};

export default VolunteerDetail;
