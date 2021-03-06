import React from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Form, ListGroup, Row } from 'react-bootstrap';
import * as routes from 'routes';
import { useVolunteers } from 'apis/volunteer';
import StatusIndicator from 'components/StatusIndicator';
import Title from 'components/Title';
import Header from 'components/Header';


const VolunteerList: React.FC = () => {
    const { volunteers } = useVolunteers();

    if (!volunteers.length) {
        return (<>
            <Header/>
            <Title>Helfer</Title>
            <ListGroup.Item>
                <Row><b style={{padding: "1rem"}}>Keine Helfer vorhanden</b></Row>
            </ListGroup.Item>
        </>);
    }

    const sortedVolunteers: any[] = volunteers.slice();
    sortedVolunteers.sort((l, r) => (l.validated === r.validated) ? 0 : l.validated ? 1 : -1);

    return (
        <>
            <Header/>
            <Title>Helfer</Title>
            <ListGroup>
                {sortedVolunteers.map((volunteer: any) => <VolunteerListItem volunteer={volunteer}
                                                                             key={volunteer.uuid}/>)}
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
};

interface ListItemProps {
    volunteer: any
}

const VolunteerListItem: React.FC<ListItemProps> = (props) => {
    const { volunteer } = props;
    const history = useHistory();
    const labelWidth = 5;

    return <ListGroup.Item action
                           onClick={() => history.push(routes.volunteerDetails(volunteer.uuid))}>
        <Row>
            <Col>
                <Row>
                    <Form.Label column md={labelWidth}>Name</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={volunteer.firstName + " " + volunteer.lastName}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Geburtstag</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={volunteer.birthDate}/>
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Form.Label column md={labelWidth}>Telefonnummer</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={volunteer.phone}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Email</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={volunteer.email}/>
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Form.Label column md={labelWidth}>Status</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={statusIndicator(volunteer)}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Label column md={labelWidth}>Ort</Form.Label>
                    <Col>
                        <Form.Control plaintext readOnly defaultValue={volunteer.zipCode + " " + volunteer.city}/>
                    </Col>
                </Row>
            </Col>
            <Col><StatusIndicator value={statusIndicatorColor(volunteer)}/></Col>
        </Row>
    </ListGroup.Item>;
};

export default VolunteerList;
