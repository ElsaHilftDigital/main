import React from 'react';

import { useVolunteers } from 'hooks/useVolunteers';
import VolunteerList from './VolunteerList';

const Volunteer = () => {
    const { volunteers } = useVolunteers();

    return (
        <div>
            <div className="sidebar">
                <VolunteerList volunteers={volunteers} />
            </div>
        </div>
    );
};

export default Volunteer;