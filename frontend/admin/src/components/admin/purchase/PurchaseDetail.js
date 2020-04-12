import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import history from '../../../history';
import { Button } from 'react-bootstrap';

import { purchaseActions } from 'store/purchase';
import { usePurchase } from 'hooks/usePurchase';
import { formatDate } from 'config/utils';


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
            registerFormSupermarket: purchase.supermarket,
            registerFormExpensesPaid: purchase.expensesPaid,
            registerFormCost: purchase.cost,
            registerFormComments: purchase.comments,
        }
    });

    const assignVolunteer = (uuid) => {
        dispatch(purchaseActions.assignVolunteer(purchase.uuid, uuid));
    };

    const notifyVolunteerToDeliver = () => {
        dispatch(purchaseActions.customerNotified(purchase.uuid));
    };

    const publishPurchaseSearchHelper = () => {
        dispatch(purchaseActions.publishPurchase(purchase.uuid));
    };

    const markPurchaseAsCompleted = () => {
        dispatch(purchaseActions.markCompleted(purchase.uuid));
    }

    const onSubmit = (data) => {
        console.log(data)
        // update purchase missing
    };

    return (
        <div className="container mt-3 mb-5">
            <div className="d-flex justify-content-between align-items-bottom">
                <h1>Details zum Einkauf vom {formatDate(purchase.createdAt)} für {purchase.customer.lastName}</h1>
                {purchase.status === "Neu" && <Button
                    onClick={() => publishPurchaseSearchHelper()}>Einkauf freigeben (Helfer suchen)</Button>}
                {purchase.status === "Einkauf abgeschlossen" && <Button
                    onClick={() => history.push("/purchase/" + purchase.uuid + "/receipt")}>Quittung ansehen</Button>}
            </div>
            <i>Die Felder von Helfern können von Moderatoren angepasst und gespeichert werden.</i>

            <form onSubmit={handleSubmit(onSubmit)} style={{paddingTop: "1em"}}>
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
                    <label htmlFor="registerFormSupermarket">Supermarkt</label>
                    <input name="registerFormSupermarket" ref={register()} type="text" className="form-control" id="registerFormSupermarket" />
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
                <div className="form-group mb-2 mb-3"><i><a href="/">Hier ist der Link zur Quittung, falls vorhanden</a></i></div>
                <div className="form-group">
                    <label htmlFor="registerFormComments">Kommentare</label>
                    <textarea name="registerFormComments" ref={register()} type="text" className="form-control" id="registerFormComments"></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="displayTableOrderItems">Einkaufsliste</label>
                    <table className="table table-striped" name="displayTableOrderItems">
                        <tbody>
                            {purchase.orderItems.map((item, index) => {
                                return <tr key={index}>
                                    <td>{item}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                <div>
                    <p>
                        <button type="submit" className="btn btn-primary m-1">Speichern</button>
                    </p>
                    <p>
                        <button onClick={() => notifyVolunteerToDeliver()} className="btn btn-primary m-1">Lieferung freigeben</button>
                    </p>
                    <p>
                        <button onClick={() => { if (window.confirm('Möchtest du diesen Einkauf wirklich als abgeschlossen markieren? Diese Aktion kann nicht rückgängig gemacht werden.')) markPurchaseAsCompleted() } } className="btn btn-primary m-1">Einkauf erledigt</button>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default PurchaseDetail;
