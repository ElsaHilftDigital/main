import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Row } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { useVolunteer, Volunteer, volunteerAPI } from 'apis/volunteer';
import { formatDate, formatDateForApiCall, parseDate } from 'config/utils';
import Header from 'components/Header';
import { useToast } from 'toasts/useToast';
import * as routes from 'routes';

const VolunteerDetail = () => {
    const { volunteerId } = useParams();
    const { volunteer } = useVolunteer(volunteerId!);

    if (!volunteer) {
        return (<>
                <Header/>
                <div className="container mt-3 mb-5">
                    <div className="spinner-border"/>
                </div>
            </>
        );
    }
    return <VolunteerDetailInternal currentVolunteer={volunteer}/>;
};

interface Props {
    currentVolunteer: Volunteer,
}

const VolunteerDetailInternal: React.FC<Props> = (props) => {
    const { currentVolunteer } = props;

    const toast = useToast();
    const history = useHistory();

    const handleConfirmVolunteer = () => {
        volunteerAPI.validate(currentVolunteer.uuid)
            .then(() =>
                toast("Helfer bestätigen", "Helfer wurde erfolgreich bestätigt.")
            )
            .catch(() =>
                toast("Helfer bestätigen", "Helfer wurde leider nicht erfolgreich bestätigt.")
            );
    };

    const onSubmit = (values: any) => {
        volunteerAPI.update(currentVolunteer.uuid, {
            ...values,
            wantsCompensation: !values.wantsNoCompensation,
            birthDate: formatDateForApiCall(parseDate(values.birthDate)),
        })
            .then(() => {
                toast("Helfer speichern", "Helfer wurde erfolgreich gespeichert.");
                history.push(routes.volunteerList());
            })
            .catch(() =>
                toast("Helfer speichern", "Helfer wurde leider nicht erfolgreich gespeichert.")
            );
    };

    const onDelete = () => {
        if (window.confirm('Bitte versichere dich, dass alle offenen Zahlungen und Entschädigungen von diesem Helfer vor dem Löschen erledigt sind.\n\nDiese Aktion kann nicht rückgängig gemacht werden.')) {
            volunteerAPI.delete(currentVolunteer.uuid)
                .then(() => {
                    toast("Helfer löschen", "Helfer wurde erfolgreich gelöscht.");
                    history.push(routes.volunteerList());
                })
                .catch(() =>
                    toast("Helfer löschen", "Helfer wurde leider nicht erfolgreich gelöscht.")
                );
        }
    };

    const { register, handleSubmit, errors, setValue } = useForm({
        defaultValues: {
            ...currentVolunteer,
            birthDate: formatDate(currentVolunteer.birthDate),
            wantsNoCompensation: !currentVolunteer.wantsCompensation,
        },
    });

    useEffect(() => {
        setValue('firstName', currentVolunteer.firstName);
        setValue('lastName', currentVolunteer.lastName);
        setValue('phone', currentVolunteer.phone);
        setValue('email', currentVolunteer.email);
        setValue('address', currentVolunteer.address);
        setValue('zipCode', currentVolunteer.zipCode);
        setValue('city', currentVolunteer.city);
        setValue('birthDate', formatDate(currentVolunteer.birthDate) as any);
        setValue('wantsNoCompensation', !currentVolunteer.wantsCompensation as any);
        setValue('iban', currentVolunteer.iban);
        setValue('bankName', currentVolunteer.bankName);
    }, [setValue, currentVolunteer]);

    return (<>
        <Header/>
        <div className="container mt-3 mb-5">
            <div className="d-flex justify-content-between align-items-bottom">
                <h1>Details von Helfer {currentVolunteer.lastName}</h1>
                {!currentVolunteer.validated && (
                    <button
                        onClick={handleConfirmVolunteer}
                        className="btn btn-primary">Helfer bestätigen</button>
                )}
            </div>
            <i>Die Felder von Helfern können von Moderatoren angepasst und gespeichert werden.</i>

            <form onSubmit={handleSubmit(onSubmit)} style={{ paddingTop: '1em' }}>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="form-group row">
                            <label htmlFor="firstName" className="col-sm-3 col-form-label">Vorname</label>
                            <div className="col-sm-9">
                                <input name="firstName" ref={register({ required: true })} type="text"
                                       className="form-control" id="firstName" placeholder="Vorname"/>
                            </div>
                            {errors.firstName && (<span className="text-danger">Vorname wird benötigt</span>)}
                        </div>
                        <div className="form-group row">
                            <label htmlFor="lastName" className="col-sm-3 col-form-label">Name</label>
                            <div className="col-sm-9">
                                <input name="lastName" ref={register({ required: true })} type="text"
                                       className="form-control" id="lastName" placeholder="Name"/>
                            </div>
                            {errors.lastName && (<span className="text-danger">Name wird benötigt</span>)}
                        </div>
                        <div className="form-group row">
                            <label htmlFor="birthDate" className="col-sm-3 col-form-label">Geburtstag</label>
                            <div className="col-sm-9">
                                <input name="birthDate" ref={register({ required: true })} type="text"
                                       className="form-control" id="birthDate"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="phone" className="col-sm-3 col-form-label">Telefonnummer</label>
                            <div className="col-sm-9">
                                <input name="phone" ref={register({ required: true })} type="tel"
                                       className="form-control" id="phone" placeholder="+41781234567"/>
                            </div>
                            {errors.phone && (<span className="text-danger">Telefonnummer wird benötigt</span>)}
                        </div>
                        <div className="form-group row">
                            <label htmlFor="email" className="col-sm-3 col-form-label">E-Mail</label>
                            <div className="col-sm-9">
                                <input name="email" ref={register({ required: true })} type="email"
                                       className="form-control" id="email" placeholder="elsa@baden.ch"/>
                            </div>
                            {errors.email && (<span className="text-danger">E-mail wird benötigt</span>)}
                        </div>
                    </div>

                    <div className="col-lg-6">

                        <div className="form-group row">
                            <label htmlFor="address" className="col-sm-3 col-form-label">Strasse</label>
                            <div className="col-sm-9">
                                <input name="address" ref={register({ required: true })} type="text"
                                       className="form-control" id="address" placeholder="Hauptrasse 1"/>
                            </div>
                            {errors.address && (<span className="text-danger">Addresse wird benötigt</span>)}
                        </div>
                        <div className="form-group row">
                            <label htmlFor="zipCode" className="col-sm-3 col-form-label">PLZ</label>
                            <div className="col-sm-9">
                                <input name="zipCode" ref={register({ required: true })} type="text"
                                       className="form-control" id="zipCode" placeholder="8000"/>
                            </div>
                            {errors.zipCode && (<span className="text-danger">PLZ wird benötigt</span>)}
                        </div>
                        <div className="form-group row">
                            <label htmlFor="city" className="col-sm-3 col-form-label">Ort</label>
                            <div className="col-sm-9">
                                <input name="city" ref={register({ required: true })} type="text"
                                       className="form-control" id="city" placeholder="Zürich"/>
                            </div>
                            {errors.city && (<span className="text-danger">Ort wird benötigt</span>)}
                        </div>
                        <div className="form-group row">
                            <label htmlFor="iban" className="col-sm-3 col-form-label">IBAN</label>
                            <div className="col-sm-9">
                                <input name="iban" ref={register()} type="text" className="form-control" id="iban"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="bankName" className="col-sm-3 col-form-label">Bank Name</label>
                            <div className="col-sm-9">
                                <input name="bankName" ref={register()} type="text" className="form-control"
                                       id="bankName"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-check mb-3">
                    <input name="wantsNoCompensation" ref={register()} type="checkbox" className="form-check-input"
                           id="wantsNoCompensation"/>
                    <label className="form-check-label" htmlFor="wantsNoCompensation">Möchte keine Entschädigung für
                        seinen / ihren Einsatz</label>
                </div>


                <Row>
                    <Col>
                        <Button type="submit">Speichern</Button>
                    </Col>
                    <Col>
                        <Button variant="danger" className="float-right" onClick={() => onDelete()}>Löschen</Button>
                    </Col>
                </Row>
            </form>
        </div>
    </>);
};

export default VolunteerDetail;
