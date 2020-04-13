import React, { useMemo, useState } from 'react';
import { Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { usePurchases } from 'hooks/usePurchases';
import * as routes from 'routes';
import { formatBoolean, formatDate, formatDateTime } from 'config/utils';


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
    };

    return <PurchaseListInternal purchases={purchases} />;
};

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

    return (
        <Container fluid>
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
                    <ListGroup variant="flush">
                        {purchasesByDate.get(selectedDate).map(p => <PurchaseListItem purchase={p} key={p.uuid} />)}
                    </ListGroup>
                </Col>
            </FlexRow>
        </Container>
    )
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

const Title = styled.h2`
    padding: 1rem;
    height: 5rem;
    vertical-align: middle;
    display: table-cell;

`;

const StatusIndicator = (props) => {
    const color = ((col) => {
        switch (col) {
            case "RED":
                return 'danger';
            case "AMBER":
                return 'warning';
            case "GREEN":
                return 'success';
            default:
                return 'error';
        }
    })(props.value);
    if (props.bottom) {
        return <span className={`text-${color} fa fa-circle`} style={{ verticalAlign: 'bottom' }} />;
    }
    return <span className={`text-${color} fa fa-circle`} />;
};

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
                        <Form.Control plaintext readOnly defaultValue={purchase.amount} />
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
