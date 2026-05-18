const keresesGomb =
    document.getElementById("keresesGomb");

const eredmenyekDoboz =
    document.getElementById("eredmenyek");


keresesGomb.addEventListener(
    "click",
    nobelDijakBetoltese
);


async function nobelDijakBetoltese() {

    const ev =
        document.getElementById("evBemenet").value;

    if (!ev) {

        eredmenyekDoboz.innerHTML = `
            <p class="hiba">
                Adj meg egy évet!
            </p>
        `;

        return;
    }

    eredmenyekDoboz.innerHTML = `
        <p class="betoltes">
            Betöltés...
        </p>
    `;

    try {

        const nobelDijValasz =
            await fetch(
                `https://api.nobelprize.org/2.1/nobelPrizes?nobelPrizeYear=${ev}`
            );

        const nobelDijAdatok =
            await nobelDijValasz.json();


        const dijazottValasz =
            await fetch(
                `https://api.nobelprize.org/2.1/laureates`
            );

        const dijazottAdatok =
            await dijazottValasz.json();


        if (
            nobelDijAdatok.nobelPrizes.length === 0
        ) {

            eredmenyekDoboz.innerHTML = `
                <p class="hiba">
                    Nincs találat erre az évre.
                </p>
            `;

            return;
        }


        eredmenyekDoboz.innerHTML = "";


        nobelDijAdatok.nobelPrizes.forEach(
            function (dij) {

                const kartya =
                    document.createElement("div");

                kartya.classList.add("kartya");


                const kategoria =
                    dij.category?.en ||
                    "Ismeretlen kategória";


                let dijazottakHtml = "";


                if (dij.laureates) {

                    dij.laureates.forEach(
                        function (dijazott) {

                            const dijazottAzonosito =
                                dijazott.id;


                            const teljesDijazott =
                                dijazottAdatok.laureates.find(
                                    function (szemely) {

                                        return (
                                            szemely.id ==
                                            dijazottAzonosito
                                        );
                                    }
                                );


                            const nev =
                                dijazott.fullName?.en ||
                                dijazott.orgName?.en ||
                                "Ismeretlen";


                            const indoklas =
                                dijazott.motivation?.en ||
                                "Nincs indoklás";


                            const szuletesiDatum =
                                teljesDijazott?.birth?.date ||
                                "Nincs adat";


                            const nem =
                                teljesDijazott?.gender ||
                                "Nincs adat";


                            dijazottakHtml += `
                                <div class="dijazott">

                                    <h3>
                                        ${nev}
                                    </h3>

                                    <p class="indoklas">
                                        ${indoklas}
                                    </p>

                                    <p>
                                        <strong>Születés:</strong>
                                        ${szuletesiDatum}
                                    </p>

                                    <p>
                                        <strong>Nem:</strong>
                                        ${nem}
                                    </p>

                                </div>
                            `;
                        }
                    );

                } else {

                    dijazottakHtml = `
                        <p>
                            Nincs díjazott adat.
                        </p>
                    `;
                }


                kartya.innerHTML = `
                    <div class="kategoria">
                        ${kategoria} (${ev})
                    </div>

                    ${dijazottakHtml}
                `;


                eredmenyekDoboz.appendChild(kartya);
            }
        );

    } catch (hiba) {

        console.error(hiba);

        eredmenyekDoboz.innerHTML = `
            <p class="hiba">
                Hiba történt az adatok lekérése közben.
            </p>
        `;
    }
}