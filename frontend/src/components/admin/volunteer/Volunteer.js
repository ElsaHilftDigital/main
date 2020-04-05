import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { volunteerActions, volunteerSelectors } from '../../../store/volunteer';
import { useVolunteers } from '../useVolunteers';
import VolunteerDetail from './VolunteerDetail';
import VolunteerList from './VolunteerList';

const Volunteer = () => {
    const dispatch = useDispatch();
    const volunteers = useVolunteers();
    const currentVolunteer = useSelector(volunteerSelectors.getCurrentVolunteer);

    const handleVolunteerUpdate = (values) => {
        console.log(values);
    };

    const handleConfirmVolunteer = (uuid) => {
        dispatch(volunteerActions.confirmVolunteer(uuid));
    };

    const handleChangeSelectedVolunteer = (uuid) => {
        dispatch(volunteerActions.setCurrentVolunteer(uuid));
    };

    return (
        <div>
            <div className="sidebar">
                <VolunteerList 
                    volunteers={volunteers} 
                    selectedVolunteerUuid={currentVolunteer ? currentVolunteer.uuid : null}
                    onSelectedVolunteerUpdate={handleChangeSelectedVolunteer}
                />
            </div>
            <div className="content">
                {currentVolunteer && (
                    <VolunteerDetail 
                        currentVolunteer={currentVolunteer}
                        onSubmit={handleVolunteerUpdate}
                        onConfirmVolunteer={handleConfirmVolunteer}
                    />
                )}
            </div>
        </div>
    );
};

export default Volunteer;