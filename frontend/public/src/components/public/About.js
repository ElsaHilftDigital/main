import React from 'react';

const About = () => {
    return (
        <div className="view bg" style={{backgroundImage: `url("ElsaHilftMehrBackgroundCropped.png")`,
            backgroundPositionX: "right", backgroundPositionY: "bottom", backgroundSize: "auto",
            backgroundRepeat:"no-repeat",backgroundColor: "hsl(240, 100%, 99%)", paddingBottom: "30%"}}>
            <div className="container pt-5">
                <h1>Über Elsa hilft</h1>
                <h4><strong><br />Ein Projekt der Elsa Benz-von Arx Stiftung unter der Leitung der Stadt Baden - Einkaufen für die Risikogruppe des Coronavirus im Bezirk Baden</strong></h4>
                <p>
                    <br />Der Bund empfiehlt seit dem 16. März 2020 allen Personen über 65 Jahren und Menschen mit Vorerkrankungen dringend, unnötige Kontakte zu vermeiden.
                    Der Aufruf wurde am 18. März 2020 verschärft und die Risikogruppe wird seither dringend angehalten, zuhause zu bleiben.
                    Mit dem Ziel, Ansteckungen und die weitere Verbreitung des Coronavirus aufzuhalten und der Risikogruppe eine niederschwellige und vertrauenserweckende Möglichkeit zu bieten,
                    hat die Stadt Baden eine Zentrale eingerichtet, die für die Risikogruppe mit der Hilfe von freiwilligen Helfenden den Einkauf erledigt:
                </p>
                <ul>
                    <li>Kostenlose und sichere Hilfe für die Risikogruppe des Coronavirus</li>
                    <li>Individuelle Einkaufswünsche möglich (Produkte und Geschäfte wählbar)</li>
                    <li>Die Hygieneregeln des Bundesamts für Gesundheit müssen befolgt werden</li>
                    <li>Die Privatsphäre der Empfängerinnen und Empfänger sowie der freiwilligen Helfenden ist geschützt, nur notwendige Daten werden ausgetauscht</li>
                </ul>

                <div>
                    <h2>Elsa für die Einkaufshilfe</h2>

                    <b>Tel. 056 200 81 85</b> (Montag bis Samstag, 8 bis 16 Uhr)
                    <p>
                        <a href="https://www.baden.ch/public/upload/assets/116736/Infoblatt%20Empf%C3%A4nger_innen.pdf">Infoblatt für Empfänger/-innen</a>
                    </p>
                </div>

                <div>
                    <h2>Datenschutz</h2>
                    Personendaten, die von Helfer/-innen oder Empfänger/-innen im Rahmen der Initiative "Elsa hilft" erhoben werden, dienen nur der Abwicklung der Einkäufe sowie der Bezahlung. <a href="https://telegram.org/">Telegram</a> wird als Kommunikationsmittel zur Koordination der Einkäufe genutzt. Es werden nur die notwendigen Daten der Empfänger/-innen an die Helfer übertragen, um den Einkauf abwickeln zu können.
                </div>

            </div>
            <div className="d-flex flex-column align-items-center">
                <img src="elsahilft_Baden.png" className="center-block m-4" width="auto" height="auto" alt="Elsa hilft" />
            </div>


        </div>
    )
};

export default About;