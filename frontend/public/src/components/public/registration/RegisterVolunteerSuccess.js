import React from 'react';


const RegisterVolunteerSuccess = (props) => {
    console.log(props);
    return (
        <div className="pl-5 pr-5 pt-3"
        style={{backgroundImage: `url("elsahilft_Baden.jpg")`,
            backgroundPositionX: "right", backgroundPositionY: "bottom",
            backgroundRepeat:"no-repeat",backgroundColor: "hsl(240, 100%, 99%)", backgroundSize: "auto", paddingBottom: "25%"}}
        >
            <h1>Willkommen im Team!</h1>
            <p>Vielen Dank, dass du dich für deinen Einsatz und dass du dich für Elsa hilft gemeldet hast!</p>
            <p>Du hast dich erfolgreich registriert und wir bitten dich <a href="https://telegram.org/">Telegram</a> herunterzuladen.</p>
            <p>
                Wir haben dir eine Bestätigung per E-Mail geschickt. Darin findest du einen Link, um mit unserem Elsa hilft Chatbot Kontakt aufzunehmen, welcher die Einkäufe koordiniert. <br />
                <b>Bitte rufe den Link mit dem Gerät auf, auf welchem Telegram installiert ist.</b> Falls das Gerät, auf welchem du dich registriert hast bereits Telegram installiert hat, kannst du <a href={props.registeredVolunteer.telegramJoinBotChatUrl}>diesen Link</a> sofort aufrufen.
            </p>
            
        </div>
    );
}

export default RegisterVolunteerSuccess;