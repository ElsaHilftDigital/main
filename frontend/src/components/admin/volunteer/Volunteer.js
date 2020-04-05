import React from 'react';

import { useVolunteers } from '../useVolunteers';
import VolunteerDetail from './VolunteerDetail';
import VolunteerList from './VolunteerList';

const Volunteer = () => {
    //const volunteers = useVolunteers();
    const currentVolunteer = {
        uuid: 'uuid',
        firstName: "Elsa",
        lastName: "Frozen",
        phone: "0562821111",
        email: "elsa@baden.ch",
        address: "Bahnhofstrasse 11",
        zipCode: "5400",
        city: "Baden",
        birthdate: "05.03.2020",
        wantsCompensation: true,
        iban: "CH05 0900 0000 4022 3664 9",
        bankName: "UBS",
        telegramJoinBotChatUrl: "test",
        validated: false,
        amountPurchases: 0,
        purchases: ""
    }

    const handleVolunteerUpdate = (values) => {
        console.log(values);
    };

    const handleConfirmVolunteer = (uuid) => {
        console.log(uuid);
    };

    const handleChangeSelectedVolunteer = (uuid) => {
        console.log(uuid);
    };

    return (
        <div>
            <div className="sidebar">
                <VolunteerList 
                    volunteers={[currentVolunteer]} 
                    selectedVolunteerUuid={1}
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