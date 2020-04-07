import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { volunteerActions, volunteerSelectors } from '../../../store/volunteer';
import { useVolunteers } from '../hooks/useVolunteers';
import VolunteerDetail from './VolunteerDetail';
import VolunteerList from './VolunteerList';

const Volunteer = () => {
    const dispatch = useDispatch();
    const { volunteers } = useVolunteers();
    const selectedVolunteer = useSelector(volunteerSelectors.selectSelectedVolunteer);

    const handleVolunteerUpdate = (values) => {
        dispatch(volunteerActions.updateVolunteer(values));
    };

    const handleConfirmVolunteer = (uuid) => {
        dispatch(volunteerActions.validateVolunteer(uuid));
    };

    const handleChangeSelectedVolunteer = (uuid) => {
        dispatch(volunteerActions.setSelectedVolunteer(uuid));
    };

    return (
        <div>
            <div className="sidebar">
                <VolunteerList 
                    volunteers={volunteers} 
                    selectedVolunteerUuid={selectedVolunteer ? selectedVolunteer.uuid : null}
                    onSelectedVolunteerUpdate={handleChangeSelectedVolunteer}
                />
            </div>
            <div className="content">
                {selectedVolunteer && (
                    <VolunteerDetail 
                        currentVolunteer={selectedVolunteer}
                        onSubmit={handleVolunteerUpdate}
                        onConfirmVolunteer={handleConfirmVolunteer}
                    />
                )}
            </div>
        </div>
    );
};

export default Volunteer;