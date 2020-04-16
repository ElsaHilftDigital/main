import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Toast from 'react-bootstrap/Toast';
import { useParams } from 'react-router-dom';

import { useVolunteer } from 'hooks/useVolunteer';
import { volunteerActions } from 'store/volunteer';
import { formatDate, parseDate } from 'config/utils';

const VolunteerDetail = () => {
    const { volunteerId } = useParams();
    const { volunteer } = useVolunteer(volunteerId);

    if (!volunteer) {
        return <span>...Loading</span>;
    }
    return <VolunteerDetailInternal currentVolunteer={volunteer}/>;
};

interface Props {
    currentVolunteer: any,
}

const VolunteerDetailInternal: React.FC<Props> = (props) => {
    const { currentVolunteer } = props;
    const dispatch = useDispatch();

    const [showSaveToast, setShowSaveToast] = useState(false);
    const [showConfirmToast, setShowConfirmToast] = useState(false);

    const handleConfirmVolunteer = (uuid: string) => {
        dispatch(volunteerActions.validateVolunteer(uuid));
        setShowConfirmToast(true);
    };

    const onSubmit = (values: any) => {
        dispatch(volunteerActions.updateVolunteer(currentVolunteer.uuid,
            {
                ...values,
                birthDate: parseDate(values.birthDate)
            }));
        setShowSaveToast(true);
    };

    const { register, handleSubmit, errors, watch, setValue } = useForm({
        defaultValues: {
            ...currentVolunteer,
            birthDate: formatDate(currentVolunteer.birthDate),
            wantsNoCompensation: !currentVolunteer.wantsCompensation,
        }
    });

    useEffect(() => {
        setValue('firstName', currentVolunteer.firstName);
        setValue('lastName', currentVolunteer.lastName);
        setValue('phone', currentVolunteer.phone);
        setValue('email', currentVolunteer.email);
        setValue('address', currentVolunteer.address);
        setValue('zipCode', currentVolunteer.zipCode);
        setValue('city', currentVolunteer.city);
        setValue('birthDate', formatDate(currentVolunteer.birthDate));
        setValue('wantsNoCompensation', !currentVolunteer.wantsCompensation);
        setValue('iban', currentVolunteer.ibane);
        setValue('bankName', currentVolunteer.bankName);
    }, [setValue, currentVolunteer]);

    const wantsNoCompensation = watch('wantsNoCompensation');

    return (<>
        <div className="position-absolute d-flex flex-column">
            {showConfirmToast &&
                <Toast className="mt-2 mb-2" onClose={() => setShowConfirmToast(false)} show={showConfirmToast} delay={3000} autohide>
                    <Toast.Header>
                    <strong className="mr-auto">Helfer bestätigen</strong>
                    </Toast.Header>
                    <Toast.Body>Der Helfer wurde bestätigt.</Toast.Body>
                </Toast>
            }
        </div>
        <div className="container mt-3 mb-5">
            <div className="d-flex justify-content-between align-items-bottom">
                <h1>Helfer {props.currentVolunteer.firstname}</h1>
                {!currentVolunteer.validated && (
                    <button
                        onClick={() => handleConfirmVolunteer(currentVolunteer.uuid)}
                        className="btn btn-primary">Helfer bestätigen</button>
                )}
            </div>
            <i>Die Felder von Helfern können von Moderatoren angepasst und gespeichert werden.</i>

            <form onSubmit={handleSubmit(onSubmit)} style={{ paddingTop: "1em" }}>
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
                    <label htmlFor="birthDate">Geburtstag <small>(DD.MM.YYYY)</small></label>
                    <input name="birthDate" ref={register({ required: true })} type="text" className="form-control" id="birthDate" />
                </div>
                <div className="form-check mb-2">
                    <input name="wantsNoCompensation" ref={register()} type="checkbox" className="form-check-input" id="wantsNoCompensation" />
                    <label className="form-check-label" htmlFor="wantsNoCompensation">Möchte keine Entschädigung für seinen Einsatz</label>
                </div>
                {!wantsNoCompensation && <>
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
                </>}
                <div className="form-group">
                    <label htmlFor="amountPurchases">Anzahl Einkäufe</label>
                    <input name="amountPurchases" type="text" className="form-control" id="amountPurchases" disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="displayTablePurchases">Erledigte Einkäufe</label>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Kundenname</th>
                                <th>Gemeinde</th>
                                <th>Datum</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                <button type="submit" className="btn btn-primary">Speichern</button>
                {showSaveToast &&
                    <Toast className="mt-2 mb-2" onClose={() => setShowSaveToast(false)} show={showSaveToast} delay={3000} autohide>
                        <Toast.Header>
                        <strong className="mr-auto">Helfer speichern</strong>
                        </Toast.Header>
                        <Toast.Body>Helfer wurde gespeichert</Toast.Body>
                    </Toast>
                }
            </form>
        </div>
    </>);
};

export default VolunteerDetail;
