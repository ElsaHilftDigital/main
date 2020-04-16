import React from 'react';
import { useHistory } from 'react-router-dom';
import * as routes from 'routes';

const VolunteerList = (props) => {
    const history = useHistory();

    if (!props.volunteers.length) {
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
                {props.volunteers.map(volunteer => (
                    <li 
                        onClick={() => history.push(routes.volunteerDetails(volunteer.uuid))}
                        key={volunteer.uuid} 
                        className={'nav-item' + (volunteer.uuid === props.selectedVolunteer?.uuid ? ' nav-item-active' : '')}
                    >
                        {volunteer.lastName}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default VolunteerList;
