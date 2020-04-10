import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { purchaseActions } from 'store/purchase';
import { useCustomer } from 'hooks/useCustomer';
import { usePurchase } from 'hooks/usePurchase';


const PurchaseDetail = () => {
    const dispatch = useDispatch();
    const { purchaseId } = useParams()

    const { purchase } = usePurchase(purchaseId);
    const { customer } = useCustomer(purchase?.customer);

    const assignVolunteer = uuid => {
        dispatch(purchaseActions.assignVolunteer(purchase.uuid, uuid));
    };

    const notifyVolunteerToDeliver = () => {
        dispatch(purchaseActions.customerNotified(purchase.uuid));
    };

    const {register, handleSubmit, setValue } = useForm({defaultValues: {
        displayFormStatus: purchase?.status,
        displayFormCreateDate: purchase?.createDate,
        displayFormVolunteerLastname: purchase?.volunteerLastname,
        displayFormVolunteerFirstname: purchase?.volunteerFirstname,
        displayFormCity: purchase?.customerCity,
        displayFormFirstname: purchase?.customerFirstname,
        displayFormLastname: purchase?.customerLastname,
        registerFormTiming: purchase?.timing,
        registerFormSupermarket: purchase?.supermarket,
        registerFormPurchaseSize: purchase?.purchaseSize,
        registerFormExpensesPaid: purchase?.expensesPaid,
        registerFormExpensesOpen: purchase?.expensesOpen,
        registerFormPaymentMethod: purchase?.paymentMethod,
        registerFormComments: purchase?.comments
    }});

    const date = new Date(purchase?.createDate);

    setValue('displayFormStatus', purchase?.status);
    setValue('displayFormCreateDate', date.toLocaleString('de-DE'));
    setValue('displayFormVolunteerLastname', purchase?.volunteerLastname);
    setValue('displayFormVolunteerFirstname', purchase?.volunteerFirstname);
    setValue('displayFormCity', customer?.city);
    setValue('displayFormFirstname', customer?.firstName);
    setValue('displayFormLastname', customer?.lastName);
    setValue('registerFormTiming', purchase?.timing);
    setValue('registerFormSupermarket', purchase?.supermarket);
    setValue('registerFormPurchaseSize', purchase?.purchaseSize);
    setValue('registerFormExpensesOpen', purchase?.expensesPaid);
    setValue('registerFormExpensesOpen', purchase?.expensesOpen);
    setValue('registerFormPaymentMethod', purchase?.paymentMethod);
    setValue('registerFormComments', purchase?.comments);

    const onSubmit = (values) => {
        console.log(values)
    };
    
    if (!purchase) {
        return <span>...Loading</span>
    }

    return (
        <div className="container mt-3 mb-5">
            <h1>Details zum Einkauf vom {date.toLocaleString('de-DE')} für {purchase.customerLastname}</h1>
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
                    <input name="registerFormTiming" ref={register()} type="text" className="form-control" id="registerFormTiming" placeholder="3.3.2020 19:00" />
                </div>
                <div className="form-group">
                    <label htmlFor="registerFormSupermarket">Supermarkt</label>
                    <input name="registerFormSupermarket" ref={register()} type="text" className="form-control" id="registerFormSupermarket" placeholder="Hauptrasse 1" />
                </div>
                <div className="form-group">
                    <label htmlFor="registerFormPurchaseSize">Grösse des Einkaufs</label>
                    <input name="registerFormPurchaseSize" ref={register({ required: true })} type="text" className="form-control" id="registerFormPurchaseSize" />
                </div>
                <div className="form-group">
                    <label htmlFor="registerFormExpensesOpen">Offene Entschädigungen</label>
                    <input name="registerFormExpensesOpen" ref={register()} type="text" className="form-control" id="registerFormExpensesOpen" />
                </div>
                <div className="form-group">
                    <label htmlFor="registerFormPaymentMethod">Zahlungsmethode</label>
                    <input name="registerFormPaymentMethod" ref={register({ required: true })} type="text" className="form-control" id="registerFormPaymentMethod" />
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
                            <tr>
                                <td>5 Tomaten</td>
                            </tr>
                            <tr>
                                <td>13 Dosen Ravioli</td>
                            </tr>
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
                        <button type="submit" className="btn btn-primary m-1">Einkauf erledigt</button>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default PurchaseDetail;