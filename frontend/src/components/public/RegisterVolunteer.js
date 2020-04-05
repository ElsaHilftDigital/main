import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { electronicFormatIBAN, isValidIBAN } from 'ibantools';

import { volunteerActions } from '../../store/volunteer';

const phoneUtil = PhoneNumberUtil.getInstance();

const RegisterVolunteer = () => {
    const dispatch = useDispatch();

    const { errors, handleSubmit, register, setValue, triggerValidation, watch } = useForm();
    const [ oldBirthdayValue, setOldBirthdayValue ] = useState('');
    const [ oldPhoneNumber, setOldPhoneNumber ] = useState('');
    const [ oldZipCode, setOldZipCode ] = useState('');
    const registerFormIban = watch('registerFormIban');
    const registerFormWantsNoCompensation = watch('registerFormWantsNoCompensation');

    const onSubmit = data => dispatch(volunteerActions.createVolunteer({
        firstName: data.registerFormFirstname,
        lastName: data.registerFormLastname,
        phone: data.registerFormPhone,
        email: data.registerFormEmail,
        address: data.registerFormStreet,
        city: data.registerFormOrt,
        zipCode: data.registerFormPlz,
        birthDate: getBirthdateAsDate(data.registerFormBirthday.replace(/\s/g, '')),
        iban: electronicFormatIBAN(data.registerFormIban),
        bankName: data.registerFormBankName,
        wantsCompensation: !data.registerFormWantsNoCompensation,
    }));

    const formatBirthdate = (e) => {
        if (!e.currentTarget.value) {
            return;
        }

        const newBirthdayValue = e.currentTarget.value;
        const characterWasDeleted = newBirthdayValue < oldBirthdayValue;

        if (!characterWasDeleted && 
            (newBirthdayValue.match(/^\d\d$/) || newBirthdayValue.match(/^\d\d \/ \d\d$/))) {
            setOldBirthdayValue( `${newBirthdayValue} / `)
            setValue('registerFormBirthday', `${newBirthdayValue} / `);
            return;
        }

        if (!newBirthdayValue.match(/^(\d| |\/)*$/)) {
            setValue('registerFormBirthday', oldBirthdayValue);
            return;
        }

        setOldBirthdayValue(newBirthdayValue);
    };

    const getBirthdateAsDate = (birthdate) => {
        const dayEndIndex = birthdate.indexOf('/');
        const monthEndIndex = birthdate.indexOf('/', dayEndIndex+1);
        const day = birthdate.substring(0,dayEndIndex);
        const month = birthdate.substring(dayEndIndex + 1, monthEndIndex);
        const year = birthdate.substring(monthEndIndex + 1);

        return new Date(`${year}-${month}-${day}`);
    }

    const validateBirthdate = (value) => {
        if (!value) {
            return false;
        }

        const birthdate = value.replace(/\s/g, '');
        const date = getBirthdateAsDate(birthdate);
        if (!(date instanceof Date && !isNaN(date))) {
            return false;
        }

        return date < new Date();
    };

    const formatPhoneNumber = (event) => {
        const phoneNumber = event.currentTarget.value;
        if (!phoneNumber) {
            return;
        }

        if (!phoneNumber.match(/^(\+)?\d*$/)) {
            setValue('registerFormPhone', oldPhoneNumber);
            return;
        }

        setOldPhoneNumber(phoneNumber);
    };

    const validatePhoneNumber = (value) => {
        if (!value) {
            return false;
        }

        let phoneNumberWithCountryCode;
        if (value.substring(0,1) === '0') {
            phoneNumberWithCountryCode = `+41${value.substring(1)}`
        } else {
            phoneNumberWithCountryCode = value;
        }

        let number = null;
        try {
            number = phoneUtil.parse(phoneNumberWithCountryCode);
        } catch (e) {
            return false;
        }

        return phoneUtil.isPossibleNumber(number);
    };

    const formatZipCode = (event) => {
        if (!event.currentTarget.value) {
            return;
        }

        const zipCode = event.currentTarget.value;
        if (!zipCode.match(/^([1-9]|[1-9]\d*)$/) || isNaN(zipCode) || +zipCode >= 10000) {
            setValue('registerFormPlz', oldZipCode)
            return;
        }

        setOldZipCode(zipCode);
    };

    const validateZipCode = (value) => {
        if(!value) {
            return false;
        }

        return !isNaN(value) && value >= 1000 && value < 10000;
    };

    const validateIBAN = (value) => {
        if (!value) {
            return false;
        }

        return isValidIBAN(electronicFormatIBAN(value));
    };

    return (
        <div className="view bg h-100" style={{padding: "0", backgroundImage: `url("ElsaHilftMehrBackgroundCropped.png")`,
            backgroundPositionX: "right", backgroundPositionY: "bottom", backgroundSize: "auto",
            backgroundRepeat:"no-repeat",backgroundColor: "hsl(240, 100%, 99%)", paddingBottom: "10%"}}>
        <div className="container pt-5 mb-5">
            <h1>Als Helfer/in registrieren</h1>
            <form onSubmit={handleSubmit(onSubmit)} >
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
                    <input onChange={formatPhoneNumber} name="registerFormPhone" ref={register({ validate: validatePhoneNumber })} type="tel" className="form-control" id="registerFormPhone" placeholder="+41781234567" />
                    {errors.registerFormPhone && (<span className="text-danger">{!!oldPhoneNumber ? 'Ungültige Telefonnummber' : 'Telefonnummer wird benötigt'}</span>)}
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
                        <input onChange={formatZipCode} name="registerFormPlz" ref={register({ validate: validateZipCode })} type="text" className="form-control" id="registerFormPlz" placeholder="8000" />
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
                    <input onChange={formatBirthdate} onBlur={() => triggerValidation('registerFormBirthday')} name="registerFormBirthday" ref={register({ validate: validateBirthdate })} type="text" className="form-control" id="registerFormBirthday" />
                    {errors.registerFormBirthday && (<span className="text-danger">{!!oldBirthdayValue ? 'Ungültiges Datum' : 'Geburtstag wird benötigt'}</span>)}
                </div>
                <div className="form-check mb-2">
                    <input name="registerFormWantsNoCompensation" ref={register()} type="checkbox" className="form-check-input" id="registerFormWantsNoCompensation" />
                    <label className="form-check-label" htmlFor="registerFormWantsNoCompensation">Ich möchte keine Entschädigung für meinen Einsatz</label>
                </div>
                {!registerFormWantsNoCompensation && (
                    <>
                        <div className="form-group">
                            <label htmlFor="registerFormIban">IBAN</label>
                            <input name="registerFormIban" ref={register({ validate: validateIBAN })} type="text" className="form-control" id="registerFormIban" />
                            {errors.registerFormIban && (<span className="text-danger">{!registerFormIban ? 'IBAN wird benötigt' : 'IBAN ist ungültig'}</span>)}
                        </div>
                        <div className="form-group">
                            <label htmlFor="registerFormBankName">Bank Name</label>
                            <input name="registerFormBankName" ref={register({ required: true })} type="text" className="form-control" id="registerFormBankName" />
                            {errors.registerFormBankName && (<span className="text-danger">Bank Name wird benötigt</span>)}
                        </div>
                    </>
                )}
                <button type="submit" className="btn btn-primary">Absenden</button>
            </form>
        </div>
        </div>
    );

};

export default RegisterVolunteer;