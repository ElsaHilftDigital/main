import React, { useState } from 'react';
import { Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { usePurchases } from 'hooks/usePurchases';
import * as routes from 'routes';
import { formatDate } from 'config/utils';


const DateCol = styled(Col)`
    position: sticky;
    top: 5rem;
    height: calc(100vh - 5rem);
    padding-left: 0;
    padding-right: 0;
    flex: 0 1;
`;

const PurchaseListCol = styled(Col)`
`

const FlexRow = styled(Row)`
    flex-wrap: nowrap !important;
`;

const DateListGroup = styled(ListGroup)`
    max-height: calc(100vh - 5rem);
    display: block !important;
    overflow-y: auto;
`;

const Title = styled.h1`
    padding: 1rem;
`;

const PurchaseList = props => {
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

    return <PurchaseListInternal purchases={purchases}/>;
};

const PurchaseListItem = (props) => {
    const { purchase } = props;
    const history = useHistory();
    const labelWidth = 5;

    return <ListGroup.Item action onClick={() => history.push(routes.purchaseDetails(purchase.uuid))}>
        <Row>
            <Col>
                Kunde
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
                        <Form.Control plaintext readOnly defaultValue={purchase.createdAt}></Form.Control>
                    </Col>
                </Row>
            </Col>
            <Col>
                Helfer
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
                Status
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
                        <Form.Control plaintext readOnly defaultValue={purchase.amount} />
                    </Col>
                </Row>
            </Col>
            <Col>
                Moderator
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

const PurchaseListInternal = (props) => {
    const {purchases} = props;

    const toDate = timestamp => new Date(timestamp).setUTCHours(0, 0, 0, 0);

    const purchaseDates = Array.from(new Set(purchases.map(purchase => toDate(purchase.createdAt)))).sort().reverse();
    const purchasesByDate = new Map(purchaseDates.map(date => [date, []]));

    purchases.forEach(purchase => purchasesByDate.get(toDate(purchase.createdAt)).push(purchase));

    const [selectedDate, setSelectedDate] = useState(purchaseDates[0]);

    return (
        <Container fluid>
            <FlexRow>
                <DateCol md="auto">
                    <Title>Datum</Title>
                    <DateListGroup variant="flush">
                        {purchaseDates.map(date => <ListGroup.Item action active={date === selectedDate} onClick={() => setSelectedDate(date)}>{formatDate(date)}</ListGroup.Item>)}
                    </DateListGroup>
                </DateCol>
                <PurchaseListCol>
                    <ListGroup variant="flush">
                        {purchasesByDate.get(selectedDate).map(p => <PurchaseListItem purchase={p} key={p.uuid} />)}
                    </ListGroup>
                </PurchaseListCol>
            </FlexRow>
        </Container>
    )
};

export default PurchaseList;
