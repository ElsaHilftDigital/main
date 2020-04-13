import React, { useState } from 'react';

import { useVolunteers } from 'hooks/useVolunteers';
import VolunteerDetail from './VolunteerDetail';
import VolunteerList from './VolunteerList';

const Volunteer = () => {
    const { volunteers } = useVolunteers();
    const [selectedVolunteer, setSelectedVolunteer] = useState(undefined);

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
                    <VolunteerDetail currentVolunteer={selectedVolunteer} />
                )}
            </div>
        </div>
    );
};

export default Volunteer;