import React, { useState } from 'react';
import Header from 'components/Header';
import Wizard, { WizardStep } from 'components/Wizard';
import { Container } from 'react-bootstrap';
import CustomerStep from './steps/CustomerStep';
import PurchaseStep from './steps/PurchaseStep';
import SubmitStep from './steps/SubmitStep';
import { CreateCustomerRequest, Customer } from 'apis/customer';

const NewRequest = () => {
    const [customer, setCustomer] = useState<Customer | CreateCustomerRequest>();
    const [purchase, setPurchase] = useState<any>({supermarkets: []});

    return <>
        <Header/>
        <Container className="mt-3 mb-5">
            {customer ? <h1>Auftrag erfassen für {customer.firstName} {customer.lastName}</h1> :
                <h1>Auftrag erfassen</h1>}
            <Wizard>
                <WizardStep name="Kunde"><CustomerStep customer={customer} setCustomer={setCustomer}/></WizardStep>
                <WizardStep name="Auftrag"><PurchaseStep purchase={purchase} setPurchase={setPurchase}/></WizardStep>
                <WizardStep name="Bestätigung"><SubmitStep customer={customer!} purchase={purchase!}/></WizardStep>
            </Wizard>
        </Container>
    </>;
};

export default NewRequest;
