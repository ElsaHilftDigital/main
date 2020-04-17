import React from 'react';
import { useHistory } from 'react-router-dom';
import { Col, ListGroup, Row, Form } from 'react-bootstrap';

import * as routes from 'routes';
import { useVolunteers } from 'hooks/useVolunteers';
import StatusIndicator from 'components/StatusIndicator';


const VolunteerList: React.FC = () => {
    const { volunteers } = useVolunteers();

    if (!volunteers.length) {
        return (
            <span>
                <span className="list-header mt-3 mb-2">Helfer</span>
                <ul className="sidebar-nav">
                    Keine Helfer
                </ul>
            </span>
        );
    };

    const sortedVolunteers: any[] = volunteers.slice();
    sortedVolunteers.sort((l, r) => (l.validated === r.validated) ? 0 : l.validated ? 1 : -1);

    return (
        <>
            <h2 style={{padding: "1rem", height: "5rem", display: "table-cell"}}>Helfer</h2>
            <ListGroup>
                {sortedVolunteers.map((volunteer: any) => <CustomerListItem volunteer={volunteer} key={volunteer.uuid} />)}
            </ListGroup>
        </>
    );
};

const statusIndicatorColor = (volunteer: any) => {
    if (volunteer.validated) {
        return "GREEN";
    }
    return "RED";
};

const statusIndicator = (volunteer: any) => {
    if (volunteer.validated) {
        return "bestätigt";
    }
    return "nicht bestätigt";
}

interface ListItemProps {
    volunteer: any
}
const CustomerListItem: React.FC<ListItemProps> = (props) => {
    const { volunteer } = props;
    const history = useHistory();
    const labelWidth = 5;

    return <ListGroup.Item action
        onClick={() => history.push(routes.volunteerDetails(volunteer.uuid))}
    >
        <Row>
            
            <Col>
                <Row>
                    <Form.Label column md={labelWidth}>Name</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={volunteer.firstName + " " + volunteer.lastName} />
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Geburtstag</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={volunteer.birthDate} />
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Form.Label column md={labelWidth}>Telefonnummer</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={volunteer.phone} />
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Email</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={volunteer.email} />
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Form.Label column md={labelWidth}>Status</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={statusIndicator(volunteer)} />
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Ort</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={volunteer.zipCode + " " + volunteer.city} />
                    </Col>
                </Row>
            </Col>
            <Col><StatusIndicator value={statusIndicatorColor(volunteer)} /></Col>
        </Row>
    </ListGroup.Item>
}

export default VolunteerList;
