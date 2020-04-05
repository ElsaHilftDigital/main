import React from 'react';
import { useForm } from 'react-hook-form';

const VolunteerDetail = (props) => {

    const {register, handleSubmit, errors} = useForm({defaultValues: {
        registerFormFirstname: props.currentVolunteer.firstname,
        registerFormLastname: props.currentVolunteer.lastname,
        registerFormPhone: props.currentVolunteer.phone,
        registerFormEmail: props.currentVolunteer.email,
        registerFormStreet: props.currentVolunteer.street,
        registerFormPlz: props.currentVolunteer.zip,
        registerFormOrt: props.currentVolunteer.city,
        registerFormBirthday: props.currentVolunteer.birthdate,
        registerFormWantsNoCompensation: props.currentVolunteer.wantsCompensation,
        registerFormIban: props.currentVolunteer.iban,
        registerFormBankName: props.currentVolunteer.bank,
        displayFormAmountPurchase: props.currentVolunteer.amountPurchases
    }});

    const onSubmit = (values) => {
        console.log(values)
    };
    // ToDo: add onSubmit in form
    return (
        <div className="container mt-3 mb-5">
            <h1>Helfer {props.currentVolunteer.firstname}</h1>
            <i>Die Felder von Helfern können von Moderatoren angepasst und gespeichert werden.</i>

            <form onSubmit={handleSubmit(onSubmit)} style={{paddingTop: "1em"}}>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="registerFormFirstname">Vorname</label>
                        <input name="registerFormFirstname" ref={register({ required: true })} type="text" className="form-control" id="registerFormFirstname" placeholder="Vorname" />
                        {errors.registerFormFirstname && (<span className="text-danger">Vorname wird benötigt</span>)}
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="registerFormLastname">Name</label>
                        <input name="registerFormLastname" ref={register({ required: true })} type="text" className="form-control" id="registerFormLastname" placeholder="Name" />
                        {errors.registerFormLastname && (<span className="text-danger">Name wird benötigt</span>)}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="registerFormPhone">Telefonnummer</label>
                    <input name="registerFormPhone" ref={register({ required: true })} type="tel" className="form-control" id="registerFormPhone" placeholder="+41781234567" />
                    {errors.registerFormPhone && (<span className="text-danger">Telefonnummer wird benötigt</span>)}
                </div>
                <div className="form-group">
                    <label htmlFor="registerFormEmail">E-Mail</label>
                    <input name="registerFormEmail" ref={register({ required: true })} type="email" className="form-control" id="registerFormEmail" placeholder="elsa@baden.ch" />
                    {errors.registerFormEmail && (<span className="text-danger">E-mail wird benötigt</span>)}
                </div>
                <div className="form-group">
                    <label htmlFor="registerFormStreet">Strasse, Nr.</label>
                    <input name="registerFormStreet" ref={register({ required: true })} type="text" className="form-control" id="registerFormStreet" placeholder="Hauptrasse 1" />
                    {errors.registerFormStreet && (<span className="text-danger">Addresse wird benötigt</span>)}
                </div>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="registerFormPlz">PLZ</label>
                        <input name="registerFormPlz" ref={register({ required: true })} type="text" className="form-control" id="registerFormPlz" placeholder="8000" />
                        {errors.registerFormPlz && (<span className="text-danger">PLZ wird benötigt</span>)}
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="registerFormOrt">Ort</label>
                        <input name="registerFormOrt" ref={register({ required: true })} type="text" className="form-control" id="registerFormOrt" placeholder="Zürich" />
                        {errors.registerFormOrt && (<span className="text-danger">Ort wird benötigt</span>)}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="registerFormBirthday">Geburtstag <small>(DD/MM/YYYY)</small></label>
                    <input name="registerFormBirthday" ref={register({ required: true })} type="text" className="form-control" id="registerFormBirthday" />
                </div>
                <div className="form-check mb-2">
                    <input name="registerFormWantsNoCompensation" ref={register()} type="checkbox" className="form-check-input" id="registerFormWantsNoCompensation" />
                    <label className="form-check-label" htmlFor="registerFormWantsNoCompensation">Ich möchte keine Entschädigung für meinen Einsatz</label>
                </div>
                <div className="form-group">
                    <label htmlFor="registerFormIban">IBAN</label>
                    <input name="registerFormIban" ref={register({ required: true })} type="text" className="form-control" id="registerFormIban" />
                    {errors.registerFormIban && (<span className="text-danger">IBAN wird benötigt</span>)}
                </div>
                <div className="form-group">
                    <label htmlFor="registerFormBankName">Bank Name</label>
                    <input name="registerFormBankName" ref={register({ required: true })} type="text" className="form-control" id="registerFormBankName" />
                    {errors.registerFormBankName && (<span className="text-danger">Bank Name wird benötigt</span>)}
                </div>
                <div className="form-group">
                    <label htmlFor="displayFormAmountPurchase">Anzahl Einkäufe</label>
                    <input name="displayFormAmountPurchase" ref={register({ required: true })} type="text" className="form-control" id="displayFormAmountPurchase" disabled />
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
