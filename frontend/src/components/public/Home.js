import React from 'react';
import history from '../../history';

const Home = () => {
    return (
        <div className="view bg" style={{backgroundImage: `url("ElsaHilftMehrBackgroundCropped.png")`,
            backgroundPositionX: "right", backgroundPositionY: "bottom", backgroundSize: "auto",
            backgroundRepeat:"no-repeat",backgroundColor: "hsl(240, 100%, 99%)", paddingBottom: "30%"}}>
            <div className="container pt-5 mb-5">
                <h1>Elsa hilft - Anmeldung als Helfer/in</h1>

                <p>
                    <br/>Willst du der Risikogruppe während der Coronakrise helfen und für sie den Einkauf erledigen?
                </p>
                <p>
                    Willst auch du Elsa unterstützen?<br/>
                    Damit du für Elsa unterwegs sein kannst, musst du mindestens 18 Jahre alt sein, in der Region wohnhaft sein und dich an folgende Hygieneregeln halten:
                </p>
                <p>
                    <ul>
                        <li>Kein direkter Kontakt mit dem Empfänger / der Empfängerin der Ware, Einkaufstasche wenn möglich vor Übergabe desinfizieren</li>
                        <li>Achte strengstens auf die Anweisungen des Bundesamtes für Gesundheit, damit du dich nicht selber infizierst: Abstand halten, gründlich Hände waschen, keine Hände schütteln, in Taschentuch oder Armbeuge husten</li>
                        <li>Sobald du Krankheitssymptome (Atembeschwerden, Husten und Fieber) spürst, kannst du ab sofort keine Einsätze mehr übernehmen</li>
                    </ul>

                    Weitere Informationen findest du hier:
                    <a href="https://www.baden.ch/elsahilft"> www.baden.ch/elsahilft</a>
                </p>
                <p>
                    Ein Projekt der Elsa Benz-von Arx-Stiftung in Zusammenarbeit mit der Stadt Baden und der Unterstützung von hilf-jetzt.ch und vielen weiteren unverzichtbaren Helfenden
                </p>
                <button type="submit" className="btn btn-primary mt-4" onClick={() => history.push("/register")}>Ich möchte mich als Helfer melden</button>
            </div>
        </div>
    );
};

export default Home;