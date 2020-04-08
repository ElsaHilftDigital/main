import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { volunteerActions, volunteerSelectors } from '../../../store/volunteer';
import { useVolunteers } from '../hooks/useVolunteers';
import VolunteerDetail from './VolunteerDetail';
import VolunteerList from './VolunteerList';

const Volunteer = () => {
    const dispatch = useDispatch();
    const { volunteers } = useVolunteers();
    const [selectedVolunteer, setSelectedVolunteer] = useState(undefined);

    const handleVolunteerUpdate = (values) => {
        dispatch(volunteerActions.updateVolunteer(values));
    };

    const handleConfirmVolunteer = (uuid) => {
        dispatch(volunteerActions.validateVolunteer(uuid));
    };

    return (
        <div>
            <div className="sidebar">
                <VolunteerList 
                    volunteers={volunteers} 
                    selectedVolunteer={selectedVolunteer}
                    onSelectedVolunteerUpdate={setSelectedVolunteer}
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