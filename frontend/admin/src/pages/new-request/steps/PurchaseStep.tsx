import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import PurchaseList from '../../../components/PurchaseList';
import { parseDate } from 'config/utils';
import { Form, InputGroup } from 'react-bootstrap';

interface Props {
    purchase: any,
    setPurchase: (purchase: any) => void,
}

interface WizardProps extends Props {
    previous: () => void;
    next: () => void;
}

const PurchaseStep: React.FC<Props> = props => {
    const { purchase, setPurchase, previous, next } = props as WizardProps;
    const { handleSubmit, register } = useForm({
        defaultValues: purchase ?? {},
    });

    const today = new Date(Date.now()).toLocaleDateString('de-DE');
    const [executionDate, setExecutionDate] = useState(today);
    const [executionDateValid, setExecutionDateValid] = useState(true);

    const handleExecutionDateUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExecutionDate(e.target.value)
    };

    const validateExecutionDate = () => {
        setExecutionDateValid(!!parseDate(executionDate))
    };

    const setPurchaseList = (list: any) => {
        setPurchase((purchase: any) => Object.assign({}, purchase, { supermarkets: list }));
    };

    const onReset = (data: any) => {
        setPurchase((purchase: any) => Object.assign({}, purchase, data));
        previous();
    };

    const onSubmit = (data: any) => {
        setPurchase((purchase: any) => Object.assign({}, purchase, data, {
            executionDate: parseDate(executionDate),
            publish: false
        }));
        next();
    };

    const onPublish = (data: any) => {
        setPurchase((purchase: any) => Object.assign({}, purchase, data, {
            executionDate: parseDate(executionDate),
            publish: true 
        }));
        next();
    };


    return (<>
        <label>Einkaufsliste</label>
        <p>
            <i>Bitte für jeden Supermarkt mit "Enter" bestätigen.</i>
        </p>
        <PurchaseList autoFocus value={purchase.supermarkets}
                      setValue={setPurchaseList} enableSave={true}/>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label htmlFor="purchaseSize">Grösse des Einkaufs</label>
                <select ref={register} id="purchaseSize" name="purchaseSize" className="form-control">
                    <option value="SMALL">Kleiner Einkauf</option>
                    <option value="MEDIUM">Mittlerer Einkauf</option>
                    <option value="LARGE">Grosser Einkauf</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="paymentMethod">Bezahlmethode</label>
                <select ref={register} id="paymentMethod" name="paymentMethod" className="form-control">
                    <option value="CASH">Bargeld</option>
                    <option value="BILL">Rechnung</option>
                    <option value="TWINT">TWINT</option>
                    <option value="OTHER">Andere</option>
                </select>
            </div>
            <Form.Group>
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
            <div className="form-group">
                <label htmlFor="timing">Zeit</label>
                <input name="timing" id="timing" type="text" ref={register} className="form-control"
                       placeholder="Braucht Einkauf bis / ab"/>
            </div>
            <div className="form-group">
                <label htmlFor="publicComments">Gruppenchat Bemerkungen</label>
                <input name="publicComments" type="text" ref={register} className="form-control" id="publicComments"
                       placeholder="Gruppenchat Bemerkungen"/>
            </div>
            <div className="form-group">
                <label htmlFor="privateComments">Private Bemerkungen</label>
                <input name="privateComments" type="text" ref={register} className="form-control"
                       id="privateComments" placeholder="Private Bemerkungen"/>
            </div>

            <button type="button" onClick={handleSubmit(onReset)} className="btn btn-primary float-left">Zurück</button>
            <button type="button" onClick={handleSubmit(onPublish)}
                    className="btn btn-primary float-right ml-2 mb-3" disabled={!executionDateValid}>Speichern & Veröffentlichen
            </button>
            <button type="submit" className="btn btn-primary float-right" disabled={!executionDateValid}>Nur Speichern</button>
        </form>
    </>);
};

export default PurchaseStep;

