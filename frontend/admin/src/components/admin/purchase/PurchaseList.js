import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { usePurchases } from 'hooks/usePurchases';
import * as routes from 'routes';
import { formatBoolean, formatDate, formatDateTime, parseDate } from 'config/utils';
import StatusIndicator from 'components/StatusIndicator';
import Title from 'components/Title';


const PurchaseList = () => {
    const { purchases } = usePurchases();

    if (!purchases?.length) {
        return (
            <span>
                <span className="list-header mt-3 mb-2">Einkäufe</span>
                <ul className="sidebar-nav">
                    Keine Einkäufe
                </ul>
            </span>
        );
    }

    return (<>
        <Container fluid>
            <PurchaseListInternal purchases={purchases} />
        </Container>
    </>);
};

const PurchaseListHeader = () => {
    const [incorrectDates, setIncorrectDates] = useState(false);
    const { register, handleSubmit, errors } = useForm();

    const onExport = (values) => {
        if (parseDate(values.startDate) > parseDate(values.endDate)){
            setIncorrectDates(true)
        }
        else {
            setIncorrectDates(false)
            const inputStartDate = parseDate(values.startDate.trim());
            const inputEndDate = parseDate(values.endDate.trim());
            window.open(routes.purchaseExportAll(inputStartDate, inputEndDate))
        }
    };

    const validateDate = (input) => {
        if (!input) {
            return false;
        }

        const inputDate = parseDate(input.trim());
        if (!(inputDate instanceof Date && !isNaN(inputDate))) {
            return false;
        }

        return inputDate;
    };

    return (<>
        <div className="row">
            <div className="flex-column">
                <Title>Aufträge</Title>
            </div>
            <div className="col" style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <form onSubmit={handleSubmit(onExport)} className="form-inline mt-3 ml-4 mr-4 mb-3 float-right">
                    {incorrectDates && (<span className="text-danger mr-4"><b>Enddatum früher als Anfangsdatum</b></span>)}
                    {(errors.startDate || errors.endDate) && (<span className="text-danger mr-4"><b>Datumseingabe inkorrekt</b></span>)}
                    <label className="sr-only" htmlFor="startDate">Startdatum</label>
                    <div className="input-group mb-2 mr-sm-2">
                        <div className="input-group-prepend">
                        <div className="input-group-text">von</div>
                        </div>
                        <input type="text" ref={register({ validate: validateDate })} onChange={() => setIncorrectDates(false)} name="startDate" className="form-control" id="startDate" placeholder="01.01.2020"></input>
                    </div>

                    <label className="sr-only" htmlFor="endDate">Enddatum</label>
                    <div className="input-group mb-2 mr-sm-2">
                        <div className="input-group-prepend">
                        <div className="input-group-text">bis</div>
                        </div>
                        <input type="text" ref={register({ validate: validateDate })} onChange={() => setIncorrectDates(false)} name="endDate" className="form-control" id="endDate" placeholder="31.12.2020"></input>
                    </div>

                    <button type="submit" className="btn btn-primary mb-2">Export</button>
                </form>

            </div>
        </div>
    </>);
}

const PurchaseListInternal = (props) => {
    const { purchases } = props;

    const toDate = timestamp => new Date(timestamp).setUTCHours(0, 0, 0, 0);

    const purchaseDates = useMemo(() => Array.from(new Set(purchases.map(purchase => toDate(purchase.createdAt)))).sort().reverse(), [purchases]);
    const purchasesByDate = useMemo(() => {
        const result = new Map(purchaseDates.map(date => [date, []]));
        purchases.forEach(purchase => result.get(toDate(purchase.createdAt)).push(purchase));
        for (const list of result.values()) {
            list.sort(purchase => new Date(purchase.createdAt)).reverse();
        }
        return result;
    }, [purchaseDates, purchases]);
    const indicators = ["RED", "AMBER", "GREEN"];
    const purchaseDateIndicators = useMemo(() => purchaseDates.map(date => {
        const index = purchasesByDate.get(date).reduce((acc, current) => Math.min(acc, indicators.indexOf(current.statusIndicator)), indicators.length);
        return indicators[index];
    }), [purchaseDates, purchasesByDate, indicators]);


    const [selectedDate, setSelectedDate] = useState(purchaseDates[0]);

    return (<>
        <FlexRow>
            <DateCol md="4">
                <Title>Datum</Title>
                <DateListGroup variant="flush">
                    {purchaseDates.map((date, i) => {
                        return <ListGroup.Item key={i} action active={date === selectedDate} onClick={() => setSelectedDate(date)}>
                            {formatDate(date)}
                            <div className="float-right"><StatusIndicator value={purchaseDateIndicators[i]} /></div>
                        </ListGroup.Item>;
                    })}
                </DateListGroup>
            </DateCol>
            <Col>
                <PurchaseListHeader />
                <ListGroup variant="flush">
                    {purchasesByDate.get(selectedDate).map(p => <PurchaseListItem purchase={p} key={p.uuid} />)}
                </ListGroup>
            </Col>
        </FlexRow>
    </>)
};

const DateCol = styled(Col)`
    position: sticky;
    top: 5rem;
    height: calc(100vh - 5rem);
    padding-left: 0;
    padding-right: 0;
    flex: 0 1 15vw;
`;

const FlexRow = styled(Row)`
    flex-wrap: nowrap !important;
`;

const DateListGroup = styled(ListGroup)`
    max-height: calc(100vh - 10rem);
    display: block !important;
    overflow-y: auto;
`;

const PurchaseListItem = (props) => {
    const { purchase } = props;
    const history = useHistory();
    const labelWidth = 5;

    return <ListGroup.Item action onClick={() => history.push(routes.purchaseDetails(purchase.uuid))}>
        <Row>
            <Col>
                <h3>Kunde</h3>
                <Row>
                    <Form.Label column md={labelWidth}>Name</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.customer.name} />
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Telefon</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.customer.phone} />
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Erstellt</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={formatDateTime(purchase.createdAt)}></Form.Control>
                    </Col>
                </Row>
            </Col>
            <Col>
                <h3>Helfer</h3>
                <Row>
                    <Form.Label column md={labelWidth}>Name</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.volunteer?.name} />
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Telefon</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.volunteer?.phone} />
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Einkauf bis</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.deadline} />
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Col md={labelWidth}>
                        <h3>Status</h3>
                    </Col>
                    <Col><StatusIndicator bottom value={purchase.statusIndicator} /></Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Zustand</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.status} />
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Betrag</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.cost} />
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Betrag beglichen</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={formatBoolean(purchase.paid)} />
                    </Col>
                </Row>
            </Col>
            <Col>
                <h3>Moderator</h3>
                <Row>
                    <Form.Label column md={labelWidth}>Erstellt von</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.createdBy} />
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Verantwortlich</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={purchase.responsible} />
                    </Col>
                </Row>
            </Col>
        </Row>
    </ListGroup.Item>;
};

export default PurchaseList;
