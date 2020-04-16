import React from 'react';
import { useHistory } from 'react-router-dom';
import { Col, ListGroup, Row } from 'react-bootstrap';

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

interface ListItemProps {
    volunteer: any
}
const CustomerListItem: React.FC<ListItemProps> = (props) => {
    const { volunteer } = props;
    const history = useHistory();

    return <ListGroup.Item
        onClick={() => history.push(routes.volunteerDetails(volunteer.uuid))}
    >
        <Row>
            <Col>{volunteer.lastName}</Col>
            <Col><StatusIndicator value={statusIndicatorColor(volunteer)} /></Col>
        </Row>
    </ListGroup.Item>
}

export default VolunteerList;
