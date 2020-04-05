import React from 'react';


const RegisterVolunteerSuccess = (props) => {
    console.log(props);
    return (
        <div className="container pt-3"
        style={{backgroundImage: `url("ElsaHilftMehrBackgroundCropped.png")`,
            backgroundPositionX: "right", backgroundPositionY: "bottom", backgroundSize: "auto",
            backgroundRepeat:"no-repeat",backgroundColor: "hsl(240, 100%, 99%)", paddingBottom: "10%"}}
        >
            <h1>Willkommen im Team!</h1>
            <p>Vielen Dank, dass du dich für Elsa hilft gemeldet hast!</p>
            <p>Du hast dich erfolgreich registriert und wir bitten dich <a href="https://telegram.org/">Telegram</a> herunterzuladen.</p>
            <p>Bitte klick nach der Installation <a href={props.registeredVolunteer.telegramJoinBotChatUrl}>hier</a>, um mit unserem Chatbot Kontakt aufzunehmen. Du wirst von uns freigeschaltet für den "Elsa hilft" Helfer-Gruppenchat.</p>
        </div>
    );
}

export default RegisterVolunteerSuccess;