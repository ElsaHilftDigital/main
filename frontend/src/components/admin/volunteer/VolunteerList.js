import React from 'react';

const VolunteerList = (props) => {
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
                        onClick={() => props.onSelectedVolunteerUpdate(volunteer.uuid)}
                        key={volunteer.uuid} 
                        className={'nav-item' + (volunteer.uuid === props.selectedVolunteerUuid ? ' nav-item-active' : '')}
                    >
                        {volunteer.lastName}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default VolunteerList;
