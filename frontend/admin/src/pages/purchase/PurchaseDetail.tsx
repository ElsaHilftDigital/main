import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Form, InputGroup } from 'react-bootstrap';
import PurchaseList from 'components/PurchaseList';
import { purchaseAPI } from 'apis/purchase';
import { usePurchase } from 'apis/purchase';
import { formatDate, parseDate } from 'config/utils';
import * as routes from 'routes';
import Header from 'components/Header';
import { useModerators } from 'apis/moderator';
import { useToast } from 'toasts/useToast';


const PurchaseDetail = () => {
    const { purchaseId } = useParams();
    const { purchase } = usePurchase(purchaseId!);
    const moderators = useModerators();

    if (!purchase) {
        return (<>
                <Header/>
                <div className="container mt-3 mb-5">
                    <div className="spinner-border"/>
                </div>
            </>
        );
    }

    return <PurchaseDetailInternal purchase={purchase} moderators={moderators}/>;
};

const PurchaseDetailInternal = (props: any) => {
    const { purchase, moderators } = props;

    const { register, handleSubmit } = useForm({
        defaultValues: purchase,
    });
    const toast = useToast();

    const [supermarkets, setSupermarkets] = useState(purchase.supermarkets);
    const [executionDate, setExecutionDate] = useState(formatDate(purchase.executionDate));
    const [executionDateValid, setExecutionDateValid] = useState(true);

    const handleExecutionDateUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExecutionDate(e.target.value)
    };

    const validateExecutionDate = () => {
        setExecutionDateValid(!!parseDate(executionDate))
    };

    const history = useHistory();

    const publishPurchaseSearchHelper = () => {
        purchaseAPI.publish(purchase.uuid)
            .then(() =>
                toast("Einkauf freigeben", "Einkauf wurde an Helfer-Gruppenchat gesendet.")
            )
            .catch(() =>
                toast("Einkauf freigeben", "Einkauf konnte leider nicht freigegeben werden.")
            );
    };

    const assignVolunteer = (uuid: string) => {
        purchaseAPI.assignVolunteer(purchase.uuid, uuid)
            .then(() =>
                toast("Helferzuordnung", "Der Helfer wurde erfolgreich zugeordnet.")
            )
            .catch(() =>
                toast("Helferzuordnung", "Der Helfer konnte leider nicht zugeordnet werden.")
            );
    };

    const deletePurchase = () => {
        if (window.confirm('Möchtest du diesen Einkauf wirklich löschen?\nDiese Aktion kann nicht rückgängig gemacht werden.')) {
            purchaseAPI.delete(purchase.uuid)
                .then(() => {
                    toast("Einkauf löschen", "Einkauf wurde erfolgreich gelöscht.")
                    history.push(routes.purchaseList());
                })
                .catch(() =>
                    toast("Einkauf löschen", "Einkauf konnte leider nicht gelöscht werden.")
                );
        }
    };

    const onSubmit = (data: any) => {
        const updatedPurchase = Object.assign({}, purchase, data, { supermarkets }, { executionDate: parseDate(executionDate) });
        purchaseAPI.update(purchase.uuid, updatedPurchase)
            .then(() => {
                toast("Einkauf speichern", "Einkauf wurde erfolgreich gespeichert.")
            })
            .catch(() =>
                toast("Einkauf speichern", "Speichern ist leider fehlgeschlagen")
            );
    };


    const onNotifyVolunteerToDeliver = (data: any) => {
        const message = window.prompt('Bitte Lieferung freigeben und Einkauf speichern mit "OK" bestätigen.\n\nBitte hier Nachricht angeben, welche über Telegram Bot an Helfer geschickt werden soll (kann leer gelassen werden):');

        if (message || message === '') {
            const updatedPurchase = Object.assign({}, purchase, data, { supermarkets });

            purchaseAPI.update(purchase.uuid, updatedPurchase)
                .then(() => purchaseAPI.notifyCustomer(purchase.uuid, message))
                .then(() => toast("Lieferung freigeben", "Einkauf wurde gespeichert und Helfer wurde benachrichtigt, dass Einkauf geliefert werden kann."))
                .catch(() =>
                    toast("Lieferung freigeben", "Einkauf konnte nicht gespeichert oder Lieferung nicht freigegeben werden.")
                );
        }
    };

    const markPurchaseAsCompleted = () => {
        if (window.confirm('Möchtest du diesen Einkauf wirklich als abgeschlossen markieren?\nDiese Aktion kann nicht rückgängig gemacht werden.')) {
            purchaseAPI.markCompleted(purchase.uuid)
                .then(() =>
                    toast("Einkauf abschliessen", "Der Einkauf wurde manuell abgeschlossen")
                )
                .catch(() =>
                    toast("Einkauf abschliessen", "Einkauf konnte leider nicht manuell abgeschlossen werden.")
                );
        }
    };

    const exportPurchase = () => {
        window.location.href = routes.purchaseExport(purchase.uuid);
    };

    return (<>
        <Header/>
        <div className="container mt-3 mb-5">
            <div className="flex-grow-0 justify-content-between align-items-bottom mb-3">
                <h1>Details zum Einkauf vom {formatDate(purchase.createdAt)} für {purchase.customer.lastName}</h1>
                <i>Die Felder von Helfern können von Moderatoren angepasst und gespeichert werden.</i>
                {(purchase.status === 'Einkauf abgeschlossen' || purchase.status === 'Kunde benachrichtigt') &&
                <p className="mt-2">
                    <b>Einkauf wurde abgeschlossen. Die nächsten Schritte sind die folgenden:
                        <ol>
                            <li>Bitte überprüfe unten, ob alle Quittungen vorhanden sind</li>
                            <li>Gesamter Betrag bei "Kosten" eintragen</li>
                            <li>Kunde/-in anrufen und Betrag kommunizieren</li>
                            <li>Auf "Speichern & Lieferung freigeben" klicken</li>
                        </ol>
                    </b>
                </p>
                }
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
                <div className="flex-grow-0">
                    {purchase.status === 'Neu' &&
                    <Button className="mr-3 mb-1"
                            onClick={() => publishPurchaseSearchHelper()}>Einkauf freigeben (Helfer suchen)</Button>}
                    {!purchase.assignedVolunteer && <>
                        <Button variant="danger" className="mr-3 mb-1"
                                onClick={() => deletePurchase()}>Löschen</Button>
                    </>}
                    {purchase.status === 'Einkauf abgeschlossen' && <>
                        <Button className="mr-3 mb-1"
                                onClick={handleSubmit(onNotifyVolunteerToDeliver)} disabled={!executionDateValid}>Speichern & Lieferung
                            freigeben</Button>
                    </>}
                    {(purchase.status === 'Kein Geld deponiert' || purchase.status === 'Ausgeliefert - Zahlung ausstehend' || purchase.status === 'Wird ausgeliefert') &&
                    <Button
                        onClick={() => markPurchaseAsCompleted()}
                        className="mr-3 mb-1">Einkauf erledigt</Button>
                    }
                </div>

                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="displayFormStatus">Status</label>
                        <input name="displayFormStatus" disabled type="text" className="form-control"
                               id="displayFormStatus" value={purchase.status}/>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="responsibleModerator">Verantwortlicher Moderator</label>
                        <select ref={register()} id="responsibleModerator" name="responsibleModerator"
                                className="form-control" defaultValue={purchase.responsible.uuid}>
                            {moderators.map((moderator: any) => {
                                return <option key={moderator.uuid} value={moderator.uuid}>{moderator.name}</option>;
                            })}
                        </select>
                    </div>

                </div>
                <div className="form-group">
                    <label htmlFor="displayFormCreateDate">Erstellungsdatum</label>
                    <input name="displayFormCreateDate" disabled type="text" className="form-control"
                        id="displayFormCreateDate" value={formatDate(purchase.createdAt)}/>
                </div>
                <div className="row">
                    <Form.Group className="col-md-6">
                        <Form.Label htmlFor="executionDate">Ausführungsdatum</Form.Label>
                        <InputGroup>
                            <Form.Control
                                id="executionDate"
                                type="text"
                                value={executionDate}
                                onChange={handleExecutionDateUpdate}
                                onBlur={validateExecutionDate}
                                isInvalid={!executionDateValid}
                            />
                        <div className="invalid-tooltip" style={{ display: 'block' }} hidden={executionDateValid}>
                            Datumsformat: DD.MM.YYYY
                        </div>
                        </InputGroup>
                    </Form.Group>
                    <div className="form-group col-md-6">
                        <label htmlFor="displayFormNumber">Auftragsnummer</label>
                        <input name="displayFormNumber" disabled type="text" className="form-control"
                            id="displayFormNumber" value={purchase.purchaseNumber}/>
                    </div>
                </div>
                

                <h5 className="mt-2"> Helfer</h5>
                {purchase.assignedVolunteer && (
                    <span>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label htmlFor="displayFormVolunteerFirstname">Vorname</label>
                                <input name="displayFormVolunteerFirstname" disabled type="text"
                                       className="form-control" id="displayFormVolunteerFirstname"
                                       value={purchase.assignedVolunteer.firstName}/>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="displayFormVolunteerLastname">Name</label>
                                <input name="displayFormVolunteerLastname" disabled type="text" className="form-control"
                                       id="displayFormVolunteerLastname" value={purchase.assignedVolunteer.lastName}/>
                            </div>
                            </div>
                    </span>
                )}
                {!purchase.assignedVolunteer && (
                    <span>
                        <div className="form-group">
                            <label>Helfer/-in wurde noch nicht ausgewählt</label>
                            {purchase.status === 'Neu' &&
                            <label><b>&nbsp;und dieser Auftrag wurde noch nicht an Helfer freigegeben.</b></label>
                            }
                            {!(purchase.status === 'Neu') && !(purchase.status === 'Veröffentlicht') &&
                            <>
                                <p>
                                    <i>Helfer, die sich gemeldet haben:</i>
                                </p>
                                <table className="table table-striped">
                                    <thead>
                                    <tr>
                                        <th>Vorname</th>
                                        <th>Nachname</th>
                                        <th>Kommt aus</th>
                                        <th>Auswahl</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {purchase.volunteerApplications.map((v: any) => {
                                        return <tr key={v.uuid}>
                                            <td>{v.firstName}</td>
                                            <td>{v.lastName}</td>
                                            <td>{v.city}</td>
                                            <td>
                                                <button type="button" className="btn btn-primary"
                                                        onClick={() => assignVolunteer(v.uuid)}>Bestätigen
                                                </button>
                                            </td>
                                        </tr>;
                                    })}
                                    </tbody>
                                </table>
                            </>
                            }
                        </div>
                    </span>
                )}

                <h5 className="mt-2"> Auftraggeber</h5>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="displayFormStreet">Strasse</label>
                        <input name="displayFormStreet" disabled type="text" className="form-control"
                               id="displayFormStreet" value={purchase.customer.address}/>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="displayFormCity">Ort</label>
                        <input name="displayFormCity" disabled type="text" className="form-control" id="displayFormCity"
                               value={purchase.customer.zipCode + ' ' + purchase.customer.city}/>
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="displayFormFirstname">Vorname</label>
                        <input name="displayFormFirstname" disabled type="text" className="form-control"
                               id="displayFormFirstname" value={purchase.customer.firstName}/>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="displayFormLastname">Name</label>
                        <input name="displayFormLastname" disabled type="text" className="form-control"
                               id="displayFormLastname" value={purchase.customer.lastName}/>
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="displayFormPhone ">Telefonnummer</label>
                        <input name="displayFormPhone " disabled type="text" className="form-control"
                               id="displayFormPhone " value={purchase.customer.phone}/>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="displayFormMobile ">Notfallnummer</label>
                        <input name="displayFormMobile " disabled type="text" className="form-control"
                               id="displayFormMobile " value={purchase.customer.mobile}/>
                    </div>
                </div>

                <h5 className="mt-2"> Einkaufsdetails</h5>
                <div className="form-group">
                    <label htmlFor="timing">Zeit</label>
                    <input name="timing" ref={register()} type="text" className="form-control" id="timing"/>
                </div>
                <div className="form-group">
                    <label htmlFor="size">Grösse des Einkaufs</label>
                    <select ref={register()} id="size" name="size" className="form-control"
                            defaultValue={purchase.size}>
                        <option value="SMALL">Kleiner Einkauf</option>
                        <option value="MEDIUM">Mittlerer Einkauf</option>
                        <option value="LARGE">Grosser Einkauf</option>
                    </select>
                </div>
                <div className="form-group">
                    {(!(purchase.status === 'Neu') && !(purchase.status === 'Veröffentlicht') && !(purchase.status === 'Helfer gefunden') && !(purchase.status === 'Helfer bestätigt')) && <>
                        <p>
                            <i>Quittungen der Einkäufe:</i>
                        </p>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>Supermarkt</th>
                                <th>Quittung</th>
                            </tr>
                            </thead>
                            <tbody>
                            {purchase.supermarkets.map((s: any) => {
                                return <tr key={s.uuid}>
                                    <td>{s.name}</td>
                                    <td>
                                        <button type="button" className="btn btn-primary"
                                                onClick={() => window.location.href = routes.purchaseReceipt(s.uuid)}>Öffnen
                                        </button>
                                    </td>
                                </tr>;
                            })}
                            </tbody>
                        </table>
                    </>}
                </div>
                <div className="form-group">
                    <label htmlFor="cost">Kosten</label>
                    <input name="cost" ref={register()} type="text" className="form-control" id="cost"/>
                </div>
                <div className="form-group">
                    <label htmlFor="paymentMethod">Zahlungsmethode</label>
                    <select ref={register()} id="paymentMethod" name="paymentMethod" className="form-control"
                            defaultValue={purchase.paymentMethod}>
                        <option value="CASH">Bargeld</option>
                        <option value="BILL">Rechnung</option>
                        <option value="TWINT">TWINT</option>
                        <option value="OTHER">Andere</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="publicComments">Gruppenchat Kommentare</label>
                    <textarea name="publicComments" ref={register()}
                              className="form-control"
                              id="publicComments"/>
                </div>
                <div className="form-group">
                    <label htmlFor="privateComments">Private Kommentare</label>
                    <textarea name="privateComments" ref={register()}
                              className="form-control"
                              id="privateComments"/>
                </div>
                <div className="form-group">
                    <label htmlFor="internalComments">Interne Kommentare</label>
                    <textarea name="internalComments" ref={register()}
                              className="form-control"
                              id="internalComments"/>
                </div>
                <div className="form-group">
                    <label htmlFor="displayTableOrderItems">Einkaufsliste</label>
                    <PurchaseList value={supermarkets} setValue={setSupermarkets}/>
                </div>

                <div className="row">
                    <div className="col">
                        <Button type="submit" disabled={!executionDateValid}>Speichern</Button>
                    </div>
                    <div className="col">
                        <Button className="float-right" onClick={() => exportPurchase()}>Export</Button>
                    </div>
                </div>
            </form>
        </div>
    </>);
};

export default PurchaseDetail;
