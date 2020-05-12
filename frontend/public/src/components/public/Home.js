import React from 'react';
import history from '../../history';

const Home = () => {
    return (
        <div className="view bg" style={{backgroundImage: `url("ElsaHilftMehrBackgroundCropped.png")`,
            backgroundPositionX: "right", backgroundPositionY: "bottom", backgroundSize: "auto",
            backgroundRepeat:"no-repeat",backgroundColor: "hsl(240, 100%, 99%)", paddingBottom: "30%"}}>
            <div className="container pt-4 mb-5">
                <h1>Elsa hilft - Anmeldung als Helfer/in</h1>
                <img src="elsahilft_Baden.png" className="center-block m-4 float-right" width="auto" height="auto" alt="" />

                <p>
                    <br/>Willst du der Risikogruppe während der Coronakrise helfen und für sie den Einkauf erledigen?
                </p>
                <p>
                    Willst auch du Elsa unterstützen?<br/>
                    Damit du für Elsa unterwegs sein kannst, musst du mindestens 18 Jahre alt sein, in der Region wohnhaft sein und dich an folgende Hygieneregeln halten:
                </p>
                    <ul>
                        <li>Kein direkter Kontakt mit dem Empfänger / der Empfängerin der Ware, Einkaufstasche wenn möglich vor Übergabe desinfizieren</li>
                        <li>Achte strengstens auf die Anweisungen des Bundesamtes für Gesundheit, damit du dich nicht selber infizierst: Abstand halten, gründlich Hände waschen, keine Hände schütteln, in Taschentuch oder Armbeuge husten</li>
                        <li>Sobald du Krankheitssymptome (Atembeschwerden, Husten und Fieber) spürst, kannst du ab sofort keine Einsätze mehr übernehmen</li>
                    </ul>

                <p>
                <i>Bitte lese zudem das folgende <a href="https://www.baden.ch/public/upload/assets/116725/Infoblatt_Helfer_innen.pdf" target="_blank" rel="noopener noreferrer">Infoblatt für Helfende</a> durch.</i>
                </p>
                <p>
                    "Elsa hilft" ist ein Projekt der Elsa Benz-von Arx-Stiftung in Zusammenarbeit mit der Stadt Baden und der Unterstützung von hilf-jetzt.ch und vielen weiteren unverzichtbaren Helfenden.
                </p>
                <button type="submit" className="btn btn-primary mt-4" onClick={() => history.push("/register")}>Ich möchte mich jetzt als Helfer melden</button>
            </div>
        </div>
    );
};

export default Home;