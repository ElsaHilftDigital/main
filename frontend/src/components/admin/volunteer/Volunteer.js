import React from 'react';

import VolunteerDetail from './VolunteerDetail';
import VolunteerList from './VolunteerList';

const Volunteer = () => {
    const currentVolunteer = {
        firstname: "Elsa",
        lastname: "Frozen",
        phone: "0562821111",
        email: "elsa@baden.ch",
        street: "Bahnhofstrasse 11",
        zip: "5400",
        city: "Baden",
        birthdate: "05.03.2020",
        wantsCompensation: true,
        iban: "CH05 0900 0000 4022 3664 9",
        bank: "UBS",
        validated: false,
        amountPurchases: 0,
        purchases: ""
    }
    return (
        <div>
            <VolunteerList />
            <VolunteerDetail currentVolunteer={currentVolunteer}/>
        </div>
    );
};

export default Volunteer;