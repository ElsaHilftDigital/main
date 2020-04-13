import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';

import { purchaseActions } from 'store/purchase';
import { usePurchase } from 'hooks/usePurchase';
import { formatDate } from 'config/utils';
import * as routes from 'routes';


const PurchaseDetail = () => {
    const { purchaseId } = useParams();
    const { purchase } = usePurchase(purchaseId);

    if (!purchase) {
        return <span>...Loading</span>;
    }

    return <PurchaseDetailInternal purchase={purchase} />;
};

const PurchaseDetailInternal = (props) => {
    const { purchase } = props;
    const dispatch = useDispatch();

    const {register, handleSubmit } = useForm({
        defaultValues: {
            displayFormStatus: purchase.status,
            displayFormCreateDate: formatDate(purchase.createdAt),
            displayFormVolunteerLastname: purchase.assignedVolunteer?.lastname,
            displayFormVolunteerFirstname: purchase.assignedVolunteer?.firstName,
            displayFormCity: purchase.customer.city,
            displayFormFirstname: purchase.customer.firstName,
            displayFormLastname: purchase.customer.lastName,
            registerFormTiming: purchase.timing,
            registerFormExpensesPaid: purchase.expensesPaid,
            registerFormCost: purchase.cost,
            registerFormComments: purchase.comments,
        }
    });

    const [showSaveToast, setShowSaveToast] = useState(false);
    const [showDeliverToast, setShowDeliverToast] = useState(false);
    const [showAssignVolunteerToast, setShowAssignVolunteerToast] = useState(false);
    const [showSearchHelperToast, setShowSearchHelperToast] = useState(false);
    const [showCompleteToast, setShowCompleteToast] = useState(false);

    const publishPurchaseSearchHelper = () => {
        dispatch(purchaseActions.publishPurchase(purchase.uuid));
        setShowSearchHelperToast(true);
    };

    const assignVolunteer = (uuid) => {
        dispatch(purchaseActions.assignVolunteer(purchase.uuid, uuid));
        setShowAssignVolunteerToast(true);
    };

    const notifyVolunteerToDeliver = () => {
        dispatch(purchaseActions.customerNotified(purchase.uuid));
        setShowDeliverToast(true);
    };

    const markPurchaseAsCompleted = () => {
        dispatch(purchaseActions.markCompleted(purchase.uuid));
        setShowCompleteToast(true)
    }

    const onSubmit = (data) => {
        // update purchase missing
        setShowSaveToast(true);
        console.log(data);
    };

    return (<>
        <div className="position-absolute d-flex flex-column">
            {showSearchHelperToast &&
                <Toast className="mt-2 mb-2" onClose={() => setShowSearchHelperToast(false)} show={showSearchHelperToast} delay={3000} autohide>
                    <Toast.Header>
                    <strong className="mr-auto">Einkauf freigeben</strong>
                    </Toast.Header>
                    <Toast.Body>Einkauf wurde an Helfer-Gruppenchat gesendet.</Toast.Body>
                </Toast>
            }
            {showAssignVolunteerToast &&
                <Toast className="mt-2 mb-2" onClose={() => setShowAssignVolunteerToast(false)} show={showAssignVolunteerToast} delay={3000} autohide>
                    <Toast.Header>
                    <strong className="mr-auto">Helferzuordnung</strong>
                    </Toast.Header>
                    <Toast.Body>Der Helfer wurde zugeordnet.</Toast.Body>
                </Toast>
            }
            {showDeliverToast &&
                <Toast className="mt-2 mb-2" onClose={() => setShowDeliverToast(false)} show={showDeliverToast} delay={3000} autohide>
                    <Toast.Header>
                    <strong className="mr-auto">Lieferung freigeben</strong>
                    </Toast.Header>
                    <Toast.Body>Helfer wurde benachrichtigt, dass Einkauf geliefert werden kann.</Toast.Body>
                </Toast>
            }
            {showCompleteToast &&
                <Toast className="mt-2 mb-2" onClose={() => setShowCompleteToast(false)} show={showCompleteToast} delay={3000} autohide>
                    <Toast.Header>
                    <strong className="mr-auto">Einkauf abgeschlossen</strong>
                    </Toast.Header>
                    <Toast.Body>Der Einkauf wurde manuell abgeschlossen.</Toast.Body>
                </Toast>
            }
        </div>


        <div className="container mt-3 mb-5">
            <div className="flex-grow-0 justify-content-between align-items-bottom mb-3">
                <h1>Details zum Einkauf vom {formatDate(purchase.createdAt)} für {purchase.customer.lastName}</h1>
                <i>Die Felder von Helfern können von Moderatoren angepasst und gespeichert werden.</i>
                
            </div>

            <div className="flex-grow-0">
                {purchase.status === "Neu" &&
                    <Button className="m-3"
                        onClick={() => publishPurchaseSearchHelper()}>Einkauf freigeben (Helfer suchen)</Button>}
                {purchase.status === "Einkauf abgeschlossen" && <>
                    <Button className="m-3"
                        onClick={() => routes.purchaseDetails(purchase.uuid)}>Quittung ansehen</Button>
                    <Button className="m-3"
                        onClick={() => notifyVolunteerToDeliver()}>Lieferung freigeben</Button>
                </>}
                {(purchase.status === "Kein Geld deponiert" || purchase.status === "Ausgeliefert - Zahlung ausstehend") &&
                    <Button
                        onClick={() => { if (window.confirm('Möchtest du diesen Einkauf wirklich als abgeschlossen markieren? Diese Aktion kann nicht rückgängig gemacht werden.')) markPurchaseAsCompleted() } }
                        className="btn btn-primary m-1">Einkauf erledigt</Button>
                }
            </div>         

            <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
                <div className="form-group">
                    <label htmlFor="displayFormStatus">Status</label>
                    <input name="displayFormStatus" ref={register({ required: true })} disabled type="text" className="form-control" id="displayFormStatus" />
                </div>
                <div className="form-group">
                    <label htmlFor="displayFormCreateDate">Erstellungsdatum</label>
                    <input name="displayFormCreateDate" ref={register({ required: true })} disabled type="tel" className="form-control" id="displayFormCreateDate" />
                </div>   
                {purchase.assignedVolunteer && (
                    <span>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label htmlFor="displayFormVolunteerFirstname">Vorname</label>
                                <input name="displayFormVolunteerFirstname" ref={register({ required: true })} disabled type="text" className="form-control" id="displayFormVolunteerFirstname" />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="displayFormVolunteerLastname">Name</label>
                                <input name="displayFormVolunteerLastname" ref={register({ required: true })} disabled type="text" className="form-control" id="displayFormVolunteerLastname" />
                            </div>
                            </div>
                        <div className="form-group mb-2 mb-3"><i><a href="/">Für weitere Infos zum Helfer hier klicken</a></i></div>
                    </span>
                )}
                {!purchase.assignedVolunteer && (
                    <span>
                        <div className="form-group">
                            <label htmlFor="applyingVolunteers">Helfer wurde noch nicht ausgewählt</label>
                            <p>
                                <i>Helfer, die sich gemeldet haben:</i>
                            </p>
                            <table className="table table-striped" name="applyingVolunteers">
                                <thead>
                                    <tr>
                                        <th>Vorname</th>
                                        <th>Nachname</th>
                                        <th>Link</th>
                                        <th>Auswahl</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchase.volunteerApplications.map((v) => {
                                        return <tr key={v.uuid}>
                                            <td>{v.firstName}</td>
                                            <td>{v.lastName}</td>
                                            <td></td>
                                            <td><button type="button" className="btn btn-primary" onClick={() => assignVolunteer(v.uuid)}>Bestätigen</button></td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </span>
                )}


                <div className="form-group">
                        <label htmlFor="displayFormCity">Ort</label>
                        <input name="displayFormCity" ref={register({ required: true })} disabled type="text" className="form-control" id="displayFormCity" />
                    </div>          
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="displayFormFirstname">Vorname</label>
                        <input name="displayFormFirstname" ref={register({ required: true })} disabled type="text" className="form-control" id="displayFormFirstname" />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="displayFormLastname">Name</label>
                        <input name="displayFormLastname" ref={register({ required: true })} disabled type="text" className="form-control" id="displayFormLastname" />
                    </div>
                </div>
                <div className="form-group mb-2 mb-3"><i><a href="/">Für weitere Infos zum Auftraggeber hier klicken</a></i></div>
                <div className="form-group">
                    <label htmlFor="registerFormTiming">Braucht Einkauf</label>
                    <input name="registerFormTiming" ref={register()} type="text" className="form-control" id="registerFormTiming" />
                </div>
                <div className="form-group">
                    <label htmlFor="registerFormPurchaseSize">Grösse des Einkaufs</label>
                    <select ref={register()} id="registerFormPurchaseSize" name="purchaseSize" className="form-control" defaultValue={purchase.size} >
                        <option value="SMALL">Kleiner Einkauf</option>
                        <option value="MEDIUM">Mittlerer Einkauf</option>
                        <option value="LARGE">Grosser Einkauf</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="registerFormCost">Kosten</label>
                    <input name="registerFormCost" ref={register({})} type="text" className="form-control" id="registerFormCost" />
                </div>

                <div className="form-group">
                    <label htmlFor="registerFormPaymentMethod">Zahlungsmethode</label>
                    <select ref={register} id="registerFormPaymentMethod" name="registerFormPaymentMethod" className="form-control" defaultValue={purchase.paymentMethod}>
                        <option value="CASH">Bargeld</option>
                        <option value="BILL">Rechnung</option>
                        <option value="TWINT">TWINT</option>
                        <option value="OTHER">Andere</option>
                    </select>
                </div>
                <div className="form-group">
                    <Link to={routes.purchaseDetails(purchase.uuid)}>Hier ist der Link zur Quittung, falls vorhanden</Link>
                </div>
                <div className="form-group">
                    <label htmlFor="registerFormComments">Kommentare</label>
                    <textarea name="registerFormComments" ref={register()} type="text" className="form-control" id="registerFormComments"></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="displayTableOrderItems">Einkaufsliste</label>
                    <ul className="list-group" name="displayTableOrderItems">
                        {purchase.supermarkets.map((supermarket, index) => {
                            return <>
                                <li className="list-group-item" key={index}>
                                    <b>Einkaufsliste {supermarket.name}:</b>
                                </li>
                                {supermarket.orderItems.map((item, itemIndex) => {
                                    return <>
                                        <li className="list-group-item" key={itemIndex}>
                                            {item}
                                        </li>
                                    </>
                                })}
                            </>
                        })}
                    </ul>
                </div>
                <div>
                    <div className="justify-content-between align-items-bottom">
                        <Button type="submit">Speichern</Button>
                        <Toast className="mt-2 mb-2" onClose={() => setShowSaveToast(false)} show={showSaveToast} delay={3000} autohide>
                            <Toast.Header>
                            <strong className="mr-auto">Einkauf speichern</strong>
                            </Toast.Header>
                            <Toast.Body>Einkauf wurde gespeichert</Toast.Body>
                        </Toast>
                    </div>
                </div>
            </form>
        </div>
    </>);
};

export default PurchaseDetail;
