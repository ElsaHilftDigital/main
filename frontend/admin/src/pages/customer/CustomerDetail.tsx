import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Row, Col, Button } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import { useParams } from 'react-router-dom';

import { customerActions } from 'store/customer/index';
import { useDispatch } from 'react-redux';
import { useCustomer } from 'hooks/useCustomer';


const CustomerDetail = () => {
    const { customerId } = useParams();
    const { customer } = useCustomer(customerId);

    if (!customer) {
        return(
            <div className="container mt-3 mb-5">
                <div className="spinner-border"></div>
            </div>
        );
    }
    return <CustomerDetailInternal selectedCustomer={customer}/>;
};

interface Props {
    selectedCustomer: any,
}

const CustomerDetailInternal: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const { selectedCustomer } = props;
    const { handleSubmit, register, setValue } = useForm({
        defaultValues: {
            firstName: selectedCustomer.firstName,
            lastName: selectedCustomer.lastName,
            phone: selectedCustomer.phone,
            mobile: selectedCustomer.mobile,
            address: selectedCustomer.address,
            zipCode: selectedCustomer.zipCode,
            city: selectedCustomer.city,
        },
    });
    const [showSaveToast, setShowSaveToast] = useState(false);
    const [showDeleteToast, setShowDeleteToast] = useState(false);

    const onSubmit = (values: any) => {
        dispatch(customerActions.updateCustomer(selectedCustomer.uuid, values));
        setShowSaveToast(true);
    };

    const onDelete = () => {
        if (window.confirm('Bitte versichere dich, dass alle offenen Rechnungen oder Zahlungen von diesem/-r Kunden/-in vor dem Löschen erledigt sind.\n\nDiese Aktion kann nicht rückgängig gemacht werden.')) {
            dispatch(customerActions.deleteCustomer(selectedCustomer.uuid));
            setShowDeleteToast(true);
        }
    }

    useEffect(() => {
        setValue('firstName', selectedCustomer.firstName);
        setValue('lastName', selectedCustomer.lastName);
        setValue('phone', selectedCustomer.phone);
        setValue('mobile', selectedCustomer.mobile);
        setValue('address', selectedCustomer.address);
        setValue('zipCode', selectedCustomer.zipCode);
        setValue('city', selectedCustomer.city);
    }, [setValue, selectedCustomer]);

    return (
        <div className="container mt-3 mb-5">
            <div className="flex-grow-0 justify-content-between align-items-bottom mb-3">
                <h1>Details für Kunde {selectedCustomer.lastName}</h1>
                <i>Die Felder von Kunden können von Moderatoren angepasst und gespeichert werden.</i>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="form-group row">
                            <label htmlFor="firstName" className="col-sm-3 col-form-label">Vorname</label>
                            <div className="col-sm-9">
                                <input name="firstName" ref={register()} type="text" className="form-control"
                                       id="firstName"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="lastName" className="col-sm-3 col-form-label">Nachname</label>
                            <div className="col-sm-9">
                                <input name="lastName" ref={register()} type="text" className="form-control"
                                       id="lastName"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="phone" className="col-sm-3 col-form-label">Festnetz</label>
                            <div className="col-sm-9">
                                <input name="phone" ref={register()} type="text" className="form-control"
                                       id="phone"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="mobile" className="col-sm-3 col-form-label">Mobil</label>
                            <div className="col-sm-9">
                                <input name="mobile" ref={register()} type="text" className="form-control"
                                       id="mobile"/>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="form-group row">
                            <label htmlFor="address" className="col-sm-3 col-form-label">Strasse</label>
                            <div className="col-sm-9">
                                <input name="address" ref={register()} type="text" className="form-control"
                                       id="addressStreet"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="zipCode" className="col-sm-3 col-form-label">PLZ</label>
                            <div className="col-sm-9">
                                <input name="zipCode" ref={register()} type="text" className="form-control"
                                       id="addressZipCode"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="city" className="col-sm-3 col-form-label">Ort</label>
                            <div className="col-sm-9">
                                <input name="city" ref={register()} type="text" className="form-control"
                                       id="addressCity"/>
                            </div>
                        </div>
                    </div>
                </div>
                <Row>
                    <Col>
                        <Button type="submit">Speichern</Button>
                            {showSaveToast &&
                            <Toast className="mt-2 mb-2" onClose={() => setShowSaveToast(false)} show={showSaveToast}
                                delay={3000}
                                autohide>
                                <Toast.Header>
                                    <strong className="mr-auto">Kunde speichern</strong>
                                </Toast.Header>
                                <Toast.Body>Auftraggeber wurde gespeichert</Toast.Body>
                            </Toast>
                            }
                    </Col>
                    <Col>
                        <Button variant="danger" className="float-right" onClick={() => onDelete()}>Löschen</Button>
                        {showDeleteToast &&
                            <Toast className="mt-2 mb-2" onClose={() => setShowDeleteToast(false)} show={showDeleteToast} delay={3000} autohide>
                                <Toast.Header>
                                <strong className="mr-auto">Kunde löschen</strong>
                                </Toast.Header>
                                <Toast.Body>Auftraggeber/-in wurde gelöscht</Toast.Body>
                            </Toast>
                        }   
                    </Col>
                </Row>
            </form>
        </div>
    );
};

export default CustomerDetail;