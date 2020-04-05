import React from 'react';
import { useForm } from 'react-hook-form';

const PurchaseDetail = (props) => {
    const {register, handleSubmit, errors} = useForm({defaultValues: {
        displayFormStatus: props.currentPurchase.status,
        displayFormCreateDate: props.currentPurchase.createDate,
        displayFormCity: props.currentPurchase.customerCity,
        displayFormFirstname: props.currentPurchase.customerFirstname,
        displayFormLastname: props.currentPurchase.customerLastname,
        registerFormTiming: props.currentPurchase.timing,
        registerFormSupermarket: props.currentPurchase.supermarket,
        registerFormPurchaseSize: props.currentPurchase.purchaseSize,
        registerFormExpensesOpen: props.currentPurchase.expensesPaid,
        registerFormExpensesOpen: props.currentPurchase.expensesOpen,
        registerFormPaymentMethod: props.currentPurchase.paymentMethod,
        registerFormComments: props.currentPurchase.comments
    }});

    const onSubmit = (values) => {
        console.log(values)
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
                    <table className="table table-striped">
                        <tr>
                            <td>5 Tomaten</td>
                        </tr>
                        <tr>
                            <td>13 Dosen Ravioli</td>
                        </tr>
                    </table>
                </div>
                <button type="submit" className="btn btn-primary">Speichern</button>
            </form>
        </div>
    );
};

export default PurchaseDetail;
