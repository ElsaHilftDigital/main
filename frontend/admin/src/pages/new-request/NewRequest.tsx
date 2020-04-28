import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useForm} from 'react-hook-form';
import {Link} from 'react-router-dom';

import SearchBox from 'components/SearchBox';
import PurchaseList from 'components/PurchaseList';
import {useCustomers} from 'hooks/useCustomers';
import * as routes from 'routes';
import Header from "components/Header";
import * as purchaseAPI from 'apis/purchase';
import * as customerAPI from 'apis/customer';

const ProgressItem: React.FC<any> = styled.li`
    position: relative;
    display: table-cell;
    text-align: center;
    font-weight: ${(props: any) => props.isActive ? 'bold' : 'normal'};
        
    &:before {
        content: '';
        display: block;
        margin: 0 auto;
        background: ${(props: any) => (props.isActive || props.isCompleted) ? '#2f2f86' : '#6c757d'};
        width: 1em;
        height: 1em;
        margin-bottom: 1em;
        line-height: 4em;
        border-radius: 100%;
        position: relative;
        z-index: 1000;
    }
    &:after {
        content: '';
        position: absolute;
        display: block;
        background: ${(props: any) => props.isCompleted ? '#2f2f86' : '#6c757d'};
        width: 100%;
        height: 0.25em;
        top: 0.375em;
        left: 50%;
        margin-left: 0.5em;
        z-index: -1;
        color: white;
    }
    &:last-child:after {
        display: none;
    }
`;

const Progress = styled.ol`
    list-style: none;
    margin: 4rem 0 2rem;
    padding: 0;
    display: table;
    table-layout: fixed;
    width: 100%;
`;

const NewRequest = () => {
        const steps = ['Kunde', 'Auftrag', 'Bestätigung'];
        const [step, setStep] = useState(0);
        const [customer, setCustomer] = useState<any>(undefined);
        const [newCustomer, setNewCustomer] = useState(false);
        const [supermarketList, setSupermarketList] = useState([]);
        const [purchase, setPurchase] = useState(undefined);

        const renderSteps = () => steps.map((s, i) => (
            <ProgressItem key={i} isActive={i === step} isCompleted={i < step}>
                <span>{s}</span>
            </ProgressItem>
        ));

        const EnterCustomer = () => {
            const {customers} = useCustomers();
            const allCustomers = customers;

            const ExistingCustomer = () => {
                const renderCustomerSuggestion = (customer: any, searchText: string) => {
                    return [
                        <div key="name">{customer.firstName} {customer.lastName}</div>,
                        <div key="address">{customer.address}</div>,
                        <div key="address2">{customer.zipCode} {customer.city}</div>,
                        <div key="phone">{customer.phone}{customer.mobile && ` / ${customer.mobile}`}</div>
                    ];
                }

                const searchTerms = (rawInput: string) => {
                    const rawTerms = rawInput.trim().split(/\s+/);
                    let terms = [];
                    let isNumber = false;
                    let numberTerm = undefined;
                    for (let i = 0; i < rawTerms.length; i++) {
                        const term = rawTerms[i].toLowerCase();
                        if (!isNaN(Number(term))) {
                            if (isNumber) {
                                numberTerm += term;
                            } else {
                                isNumber = true;
                                numberTerm = term;
                            }
                        } else {
                            if (isNumber) {
                                isNumber = false;
                                terms.push(numberTerm);
                                terms.push(term);
                            } else {
                                terms.push(term);
                            }
                        }
                    }
                    if (isNumber) {
                        terms.push(numberTerm);
                    }
                    return terms;
                }
                const matches = (customer: any, searchText: string) => {
                    const terms = searchTerms(searchText);
                    const {id, uuid, ...remainder} = customer;
                    const properties = Object.values(remainder).map((s: any) => s.toLowerCase());
                    return terms.every(term => properties.some(prop => prop.includes(term)));
                }
                return <>
                    <SearchBox
                        items={allCustomers}
                        onChange={setCustomer}
                        filter={matches}
                        renderItem={renderCustomerSuggestion}/>
                    {customer && <>
                        <div className="row mt-3">
                            <div className="form-group col-md-6">
                                <label htmlFor="firstName">Vorname</label>
                                <input disabled name="firstName" type="text" className="form-control" id="firstName"
                                       value={customer.firstName}/>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="lastName">Nachname</label>
                                <input disabled name="lastName" type="text" className="form-control" id="lastName"
                                       value={customer.lastName}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Adresse</label>
                            <input disabled name="address" type="text" className="form-control" id="address"
                                   value={customer.address}/>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label htmlFor="zipCode">PLZ</label>
                                <input disabled name="zipCode" type="text" className="form-control" id="zipCode"
                                       value={customer.zipCode}/>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="city">Ort</label>
                                <input disabled name="city" type="text" className="form-control" id="city"
                                       value={customer.city}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label htmlFor="phone">Telefonnummer</label>
                                <input disabled name="phone" type="text" className="form-control" id="phone"
                                       value={customer.phone}/>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="mobile">Notfallnummer</label>
                                <input disabled name="mobile" type="text" className="form-control" id="mobile"
                                       value={customer.mobile}/>
                            </div>
                        </div>
                    </>}
                    <form className="mt-3" onSubmit={() => setStep(step + 1)}>
                        <button type="submit" disabled={!customer || !customer.uuid}
                                className="btn btn-primary float-right">Weiter
                        </button>
                    </form>
                </>;
            };

            const NewCustomer = () => {
                const {errors, handleSubmit, register} = useForm({
                    defaultValues: customer ?? {}
                });
                const onSubmit = (data: any) => {
                    setCustomer(data);
                    setStep(step + 1);
                }

                return <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label htmlFor="firstName">Vorname</label>
                            <input name="firstName" type="text" ref={register({required: true})} className="form-control"
                                   id="firstName" placeholder="Vorname"/>
                            {errors.firstName && (<span className="text-danger">Vorname wird benötigt</span>)}
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="lastName">Nachname</label>
                            <input name="lastName" type="text" ref={register({required: true})} className="form-control"
                                   id="lastName" placeholder="Nachname"/>
                            {errors.lastName && (<span className="text-danger">Nachname wird benötigt</span>)}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Adresse</label>
                        <input name="address" type="text" ref={register({required: true})} className="form-control"
                               id="address" placeholder="Adresse"/>
                        {errors.address && (<span className="text-danger">Adresse wird benötigt</span>)}
                    </div>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label htmlFor="zipCode">PLZ</label>
                            <input name="zipCode" type="text" ref={register()} className="form-control"
                                   id="zipCode" placeholder="PLZ"/>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="city">Ort</label>
                            <input name="city" type="text" ref={register({required: true})} className="form-control"
                                   id="city" placeholder="Ort"/>
                            {errors.city && (<span className="text-danger">Ort wird benötigt</span>)}
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label htmlFor="phone">Telefonnummer</label>
                            <input name="phone" type="text" ref={register({required: true})} className="form-control"
                                   id="phone" placeholder="Telefonnummer"/>
                            {errors.phone && (<span className="text-danger">Telefonnummer wird benötigt</span>)}
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="mobile">Notfallnummer</label>
                            <input name="mobile" type="text" ref={register()} className="form-control" id="mobile"
                                   placeholder="Notfallnummer"/>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary float-right">Weiter</button>
                </form>;
            };

            return (<>
                <form className="mb-3">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" checked={!newCustomer} onChange={() => {
                            setNewCustomer(false);
                            setCustomer(undefined);
                        }} type="radio" id="existing" name="customerType"/>
                        <label className="form-check-label" htmlFor="existing">Bestehender Kunde</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" checked={newCustomer} onChange={() => {
                            setNewCustomer(true);
                            setCustomer(undefined);
                        }} type="radio" id="new" name="customerType"/>
                        <label className="form-check-label" htmlFor="new">Neuer Kunde</label>
                    </div>
                </form>
                {newCustomer ? <NewCustomer/> : <ExistingCustomer/>}
            </>);
        };

        const EnterPurchase = () => {
            const {handleSubmit, register} = useForm({
                defaultValues: purchase ?? {}
            });
            const onReset = (data: any) => {
                setPurchase(data);
                setStep(step - 1);
            };

            const onSubmit = (data: any) => {
                setPurchase(data)
                setStep(step + 1);
            };

            return (<>
                <label>Einkaufsliste</label>
                <p>
                    <i>Bitte für jeden Supermarkt mit "Enter" bestätigen.</i>
                </p>
                <PurchaseList autoFocus value={supermarketList} setValue={setSupermarketList}/>
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

                    <button type="button" onClick={handleSubmit(onReset)} className="btn btn-primary float-left">Zurück
                    </button>
                    <button type="submit" className="btn btn-primary float-right">Speichern</button>
                </form>
            </>);
        };

        const renderContent = () => {
            switch (step) {
                case 0:
                    return <EnterCustomer/>;
                case 1:
                    return <EnterPurchase/>;
                case 2:
                    return newCustomer
                        ? <SubmitNewCustomer customer={customer} purchase={Object.assign({}, purchase,
                            {supermarkets: supermarketList})}/>
                        : <SubmitExistingCustomer purchase={Object.assign({}, purchase, {
                            supermarkets: supermarketList,
                            customer: customer.uuid,
                        })}/>;
                default:
                    return null;
            }
        };
        return (<>
                <Header/>
                <div className="container mt-3 mb-5">
                    {!!customer ? <h1>Auftrag erfassen für {customer.firstName} {customer.lastName}</h1> :
                        <h1>Auftrag erfassen</h1>}
                    <Progress>{renderSteps()}</Progress>
                    {renderContent()}
                </div>
            </>
        );
    }
;

export default NewRequest;


const SubmitExistingCustomer: React.FC<{ purchase: any }> = props => {
    const [loading, setLoading] = useState<boolean>(true);
    const [uuid, setUuid] = useState<string>();

    useEffect(() => {
        purchaseAPI.createPurchase(props.purchase)
            .then(newPurchase => {
                setLoading(false);
                setUuid(newPurchase.uuid);
            })
            .catch(() => setLoading(false))
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
        customerAPI.createCustomer(props.customer)
            .then(newCustomer => {
                setCustomerUuid(newCustomer.uuid);
                setCustomerLoading(false);
                const purchase = Object.assign({}, props.purchase, {customer: newCustomer.uuid});
                return purchaseAPI.createPurchase(purchase)
            })
            .then(newPurchase => {
                setPurchaseLoading(false);
                setPurchaseUuid(newPurchase.uuid);
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
}
