import React from 'react';


const RegisterVolunteerSuccess = (props) => {
    console.log(props);
    return (
        <div className="view bg" style={{backgroundImage: `url("ElsaHilftMehrBackgroundCropped.png")`,
            backgroundPositionX: "right", backgroundPositionY: "bottom", backgroundSize: "auto",
            backgroundRepeat:"no-repeat",backgroundColor: "hsl(240, 100%, 99%)", paddingBottom: "30%"}}>
            <div className="container pt-4">
                <h1>Willkommen im Team!</h1>
                <p>Vielen Dank, dass du dich für deinen Einsatz und dass du dich für Elsa hilft gemeldet hast!</p>
                <p>Du hast dich erfolgreich registriert und wir bitten dich <a href="https://telegram.org/">Telegram</a> herunterzuladen.</p>
                <p>
                    Wir haben dir eine Bestätigung per E-Mail geschickt. Darin findest du einen Link, um mit unserem Elsa hilft Chatbot Kontakt aufzunehmen, welcher die Einkäufe koordiniert. <b>Bitte rufe den Link mit dem Gerät auf, auf welchem Telegram installiert ist.</b> Falls das Gerät, auf welchem du dich registriert hast bereits Telegram installiert hat, kannst du <a href={props.registeredVolunteer.telegramJoinBotChatUrl}>diesen Link</a> sofort aufrufen.
                </p>
            </div>
            <div className="d-flex flex-column align-items-center">
                <img src="elsahilft_Baden.png" className="center-block m-4" width="auto" height="auto" alt="Elsa hilft" />
            </div>
        </div>
    );
}

export default RegisterVolunteerSuccess;