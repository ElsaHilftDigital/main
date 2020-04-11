import React from 'react';
import { Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { usePurchases } from 'hooks/usePurchases';
import * as routes from 'routes';


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

    return (
        <Container fluid>
            <ListGroup variant="flush">
                {purchases.map(p => <PurchaseListItem purchase={p} key={p.uuid} />)}
            </ListGroup>
        </Container>
    )
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

export default PurchaseList;
