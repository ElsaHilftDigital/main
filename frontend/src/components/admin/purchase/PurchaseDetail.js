import React from 'react';
import { useForm } from 'react-hook-form';

import { purchaseActions } from '../../../store/purchase';
import { useDispatch } from 'react-redux';

const PurchaseDetail = (props) => {
    const { currentPurchase } = props;
    const {register, handleSubmit, setValue } = useForm({defaultValues: {
        displayFormStatus: currentPurchase.status,
        displayFormCreateDate: currentPurchase.createDate,
        displayFormVolunteerLastname: currentPurchase.volunteerLastname,
        displayFormVolunteerFirstname: currentPurchase.volunteerFirstname,
        displayFormCity: currentPurchase.customerCity,
        displayFormFirstname: currentPurchase.customerFirstname,
        displayFormLastname: currentPurchase.customerLastname,
        registerFormTiming: currentPurchase.timing,
        registerFormSupermarket: currentPurchase.supermarket,
        registerFormPurchaseSize: currentPurchase.purchaseSize,
        registerFormExpensesOpen: currentPurchase.expensesPaid,
        registerFormExpensesOpen: currentPurchase.expensesOpen,
        registerFormPaymentMethod: currentPurchase.paymentMethod,
        registerFormComments: currentPurchase.comments
    }});

    setValue('displayFormStatus', currentPurchase.status);
    setValue('displayFormCreateDate', currentPurchase.createDate);
    setValue('displayFormVolunteerLastname', currentPurchase.volunteerLastname);
    setValue('displayFormVolunteerFirstname', currentPurchase.volunteerFirstname);
    setValue('displayFormCity', currentPurchase.customerCity);
    setValue('displayFormFirstname', currentPurchase.customerFirstname);
    setValue('displayFormLastname', currentPurchase.customerLastname);
    setValue('registerFormTiming', currentPurchase.timing);
    setValue('registerFormSupermarket', currentPurchase.supermarket);
    setValue('registerFormPurchaseSize', currentPurchase.purchaseSize);
    setValue('registerFormExpensesOpen', currentPurchase.expensesPaid);
    setValue('registerFormExpensesOpen', currentPurchase.expensesOpen);
    setValue('registerFormPaymentMethod', currentPurchase.paymentMethod);
    setValue('registerFormComments', currentPurchase.comments);

    const onSubmit = (values) => {
        console.log(values)
    };

    const dispatch = useDispatch();

    const assignVolunteer = uuid => {
        dispatch(purchaseActions.assignVolunteer(props.currentPurchase.uuid, uuid));
    };
    
    return(
        <div className="container mt-3 mb-5">
            <h1>Details zum Einkauf vom {props.currentPurchase.createDate} für {props.currentPurchase.customerLastname}</h1>
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

                {props.currentPurchase.volunteerIsChosen && (
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
                        <div className="form-group mb-2 mb-3"><i><a href="">Für weitere Infos zum Helfer hier klicken</a></i></div>
                    </span>
                )}
                {!props.currentPurchase.volunteerIsChosen && (
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
                                    {props.currentPurchase.volunteerApplications.map((v) => {
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
                <div className="form-group mb-2 mb-3"><i><a href="">Für weitere Infos zum Auftraggeber hier klicken</a></i></div>
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
                <div className="form-group mb-2 mb-3"><i><a href="">Hier ist der Link zur Quittung, falls vorhanden</a></i></div>
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
                        <button type="submit" className="btn btn-primary m-1">Einkauf freigeben</button>
                    </p>
                    <p>
                        <button type="submit" className="btn btn-primary m-1">Lieferung freigeben</button>
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
