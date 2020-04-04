import React from 'react';

import VolunteerDetail from './VolunteerDetail';
import VolunteerList from './VolunteerList';

const Volunteer = () => {
    return (
        <div>
            <VolunteerList />
            <VolunteerDetail />
        </div>
    );
};

export default Volunteer;