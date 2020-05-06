import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Row } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { Customer, customerAPI, useCustomer } from 'apis/customer';
import Header from 'components/Header';
import { useToast } from 'toasts/useToast';
import * as routes from 'routes';

const CustomerDetail = () => {
    const { customerId } = useParams();
    const { customer, refresh } = useCustomer(customerId!);

    if (!customer) {
        return (<>
                <Header/>
                <div className="container mt-3 mb-5">
                    <div className="spinner-border"/>
                </div>
            </>
        );
    }
    return <CustomerDetailInternal selectedCustomer={customer} refresh={refresh}/>;
};

interface Props {
    selectedCustomer: Customer,
    refresh: () => void;
}

const CustomerDetailInternal: React.FC<Props> = props => {
    const { selectedCustomer } = props;
    const { handleSubmit, register } = useForm({
        defaultValues: selectedCustomer,
    });
    const toast = useToast();
    const history = useHistory();

    const onSubmit = (values: any) => {
        customerAPI.update(selectedCustomer.uuid, values)
            .then(() => {
                toast("Kunde speichern", "Auftraggeber wurde gespeichert");
                props.refresh();
            })
            .catch(() =>
                toast("Kunde speichern", "Speichern ist leider fehlgeschlagen")
            );
    };

    const onDelete = () => {
        if (window.confirm('Bitte versichere dich, dass alle offenen Rechnungen oder Zahlungen von diesem/-r Kunden/-in vor dem Löschen erledigt sind.\n\nDiese Aktion kann nicht rückgängig gemacht werden.')) {
            customerAPI.delete(selectedCustomer.uuid)
                .then(() => {
                    toast("Kunde löschen", "Auftraggeber/-in wurde gelöscht");
                    history.push(routes.customerList());
                    
                })
                .catch(() =>
                    toast("Kunde löschen", "Löschen ist leider fehlgeschlagen")
                );
        }
    };

    return (<>
        <Header/>
        <div className="container mt-3 mb-5">
            <div className="flex-grow-0 justify-content-between align-items-bottom mb-3">
                <h1>Details von Kunde {selectedCustomer.lastName}</h1>
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
                    </Col>
                    <Col>
                        <Button variant="danger" className="float-right" onClick={() => onDelete()}>Löschen</Button>
                    </Col>
                </Row>
            </form>
        </div>
    </>);
};

export default CustomerDetail;