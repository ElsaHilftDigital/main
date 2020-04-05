import React from 'react';

const Home = () => {
    return (
        <div className="container mt-3 mb-5">
            <h1>Elsa hilft - Anmeldung als Helfer/in</h1>

            <p>
                Willst du der Risikogruppe während der Coronakrise helfen und für sie den Einkauf erledigen?
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
                www.baden.ch/elsahilft
            </p>
            <p>
                Ein Projekt der Elsa Benz-von Arx-Stiftung in Zusammenarbeit mit der Stadt Baden und der Unterstützung von hilf-jetzt.ch und vielen weiteren unverzichtbaren Helfenden
            </p>
        </div>
    );
};

export default Home;