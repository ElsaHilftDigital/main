import React, { useEffect, useState } from 'react';
import { Purchase, purchaseAPI } from 'apis/purchase';
import { Link } from 'react-router-dom';
import * as routes from 'routes';
import { CreateCustomerRequest, Customer, customerAPI } from 'apis/customer';


interface Props {
    customer: Customer | CreateCustomerRequest,
    purchase: Purchase,
}

const SubmitStep: React.FC<Props> = props => {
    const isNew = props.customer && !('uuid' in props.customer);
    if (isNew) {
        return <SubmitNewCustomer customer={props.customer} purchase={props.purchase}/>
    } else {
        const customer = props.customer as Customer;
        const purchase = Object.assign({}, props.purchase, {customer: customer.uuid})
        return <SubmitExistingCustomer purchase={purchase}/>
    }
};

export default SubmitStep;

const SubmitExistingCustomer: React.FC<{ purchase: any }> = props => {
    const [loading, setLoading] = useState<boolean>(true);
    const [uuid, setUuid] = useState<string>();

    useEffect(() => {
        purchaseAPI.create(props.purchase)
            .then(setUuid)
            .catch()
            .finally(() => setLoading(false));
    }, [props.purchase]);

    if (loading) {
        return <div className="spinner-border" role="status"/>;
    }
    if (uuid) {
        return <>
            <div className="alert alert-success" role="alert">Auftrag erfolgreich erstellt</div>
            <Link to={routes.purchaseDetails(uuid)}>Hier geht es zum Auftrag. Bitte Auftrag
                freigeben.</Link>
        </>;
    }
    return <div className="alert alert-danger" role="alert">Fehler beim Erstellen des Auftrags</div>;
};

const SubmitNewCustomer: React.FC<{ customer: any, purchase: any }> = props => {
    const [customerLoading, setCustomerLoading] = useState(true);
    const [purchaseLoading, setPurchaseLoading] = useState(true);
    const [customerUuid, setCustomerUuid] = useState<string>();
    const [purchaseUuid, setPurchaseUuid] = useState<string>();

    useEffect(() => {
        customerAPI.create(props.customer)
            .then(newCustomer => {
                setCustomerUuid(newCustomer.uuid);
                setCustomerLoading(false);
                const purchase = Object.assign({}, props.purchase, { customer: newCustomer.uuid });
                return purchaseAPI.create(purchase);
            })
            .then(purchaseUuid => {
                setPurchaseLoading(false);
                setPurchaseUuid(purchaseUuid);
            })
            .catch(() => {
                setCustomerLoading(false);
                setPurchaseLoading(false);
            });
    }, [props.customer, props.purchase]);

    return <>
        {(customerLoading || purchaseLoading) && <div className="spinner-border" role="status"/>}
        {!customerLoading &&
        <>
            {customerUuid
                ? <div className="alert alert-success" role="alert">Kunde erfolgreich erstellt</div>
                : <div className="alert alert-danger" role="alert">Fehler beim Erstellen des Kunden</div>
            }
        </>
        }
        {!purchaseLoading &&
        <>
            {purchaseUuid
                ? <>
                    <div className="alert alert-success" role="alert">Auftrag erfolgreich erstellt</div>
                    <Link to={routes.purchaseDetails(purchaseUuid)}>Hier geht es zum Auftrag. Bitte Auftrag
                        freigeben.</Link>
                </>
                : <div className="alert alert-danger" role="alert">Fehler beim Erstellen des Auftrags</div>
            }
        </>
        }
    </>;
};
