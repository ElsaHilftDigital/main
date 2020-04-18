import React from 'react';
import { useHistory } from 'react-router-dom';
import { useCustomers } from 'hooks/useCustomers';

import * as routes from 'routes';
import Title from 'components/Title';
import { Col, ListGroup, Row, Form } from 'react-bootstrap';

const CustomerList: React.FC = () => {
    const { customers } = useCustomers();

    if (!customers.length) {
        return (<>
                <Title>Kunden</Title>
                <ListGroup.Item>
                    <Row><b style={{padding: "1rem"}}>Keine Kunden vorhanden</b></Row>
                </ListGroup.Item>
        </>);
    }

    return (
        <>
            <Title>Kunden</Title>
            <ListGroup>
                {customers.map((customer: any) => <CustomerListItem key={customer.uuid} customer={customer}/>)}
            </ListGroup>
        </>
    );
};

interface ListItemProps {
    customer: any,
}

const CustomerListItem: React.FC<ListItemProps> = props => {
    const { customer } = props;
    const history = useHistory();
    const labelWidth = 5;

    return <ListGroup.Item action
                           onClick={() => history.push(routes.customerDetails(customer.uuid))}>
        <Row>
            <Col>
                <Row>
                    <Form.Label column md={labelWidth}>Vorname</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={customer.firstName}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Nachname</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={customer.lastName}/>
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Form.Label column md={labelWidth}>Festnetz</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={customer.phone}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Mobil</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={customer.mobile}/>
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Form.Label column md={labelWidth}>Strasse</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={customer.address}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Ort</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={customer.zipCode + " " + customer.city}/>
                    </Col>
                </Row>
            </Col>
            <Col></Col>
        </Row>
    </ListGroup.Item>;
};

export default CustomerList;
