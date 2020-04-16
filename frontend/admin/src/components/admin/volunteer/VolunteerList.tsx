import React from 'react';
import { useHistory } from 'react-router-dom';

import * as routes from 'routes';
import { useVolunteers } from 'hooks/useVolunteers';

const VolunteerList: React.FC = () => {
    const history = useHistory();
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

    return (
        <>
            <span className="list-header mt-3 mb-2">Helfer</span>
            <ul className="sidebar-nav">
                {volunteers.map((volunteer: any) => (
                    <li 
                        onClick={() => history.push(routes.volunteerDetails(volunteer.uuid))}
                        key={volunteer.uuid} 
                    >
                        {volunteer.lastName}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default VolunteerList;
