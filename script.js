const KATEGORIA_NEVEK = {
  "Physics":                "Fizika",
  "Chemistry":              "Kémia",
  "Physiology or Medicine": "Orvostudomány",
  "Literature":             "Irodalom",
  "Peace":                  "Béke",
  "Economic Sciences":      "Közgazdaságtan"
};

let osszesDij = [];

async function mindentBetolt() {

  let offset = 0;
  let osszesen = null;

  while (offset === 0 || offset < osszesen) {
    const valasz = await fetch(`https://api.nobelprize.org/2.1/nobelPrizes?offset=${offset}&limit=100`);
    const adat = await valasz.json();
    if (osszesen === null) osszesen = adat.meta.count;
    osszesDij = osszesDij.concat(adat.nobelPrizes);
    offset += 100;
  }

  evSzuroFeltolt();
  uzenetMutat("Válasszon évet a fenti legördülő menüből.");
}

function evSzuroFeltolt() {
  const evek = [...new Set(osszesDij.map(d => d.awardYear))].sort((a, b) => b - a);
  const sel = document.getElementById("ev-szuro");
  evek.forEach(ev => {
    const opt = document.createElement("option");
    opt.value = ev;
    opt.textContent = ev;
    sel.appendChild(opt);
  });
}

function evDijaiMutat(ev) {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  osszesDij.filter(d => d.awardYear === ev).forEach(dij => {
    const kategoria = KATEGORIA_NEVEK[dij.category?.en] || dij.category?.en || "Ismeretlen";
    const motivacio = dij.laureates?.[0]?.motivation?.en || "";
    const dijOsszeg = dij.prizeAmount ? dij.prizeAmount.toLocaleString("hu-HU") + " SEK" : "";
    const dijazottak = (dij.laureates || [])
      .map(l => `<span class="dijazott">${l.knownName?.en || l.orgName?.en || "Ismeretlen"}</span>`)
      .join("");

    const div = document.createElement("div");
    div.className = "dijkartya";
    div.innerHTML = `
      <div class="dijkartya-fej">
        <span class="kategoria-label">${kategoria}</span>
      </div>
      ${dijazottak ? `<div class="dijazottak">${dijazottak}</div>` : ""}
      ${motivacio ? `<div class="motivacio">"${motivacio}"</div>` : ""}
      ${dijOsszeg ? `<div class="dijossz">Díjösszeg: ${dijOsszeg}</div>` : ""}
    `;
    lista.appendChild(div);
  });
}

function uzenetMutat(szoveg) {
  document.getElementById("lista").innerHTML = `<div id="uzenet">${szoveg}</div>`;
}

document.getElementById("ev-szuro").addEventListener("change", function () {
  if (this.value) evDijaiMutat(this.value);
  else uzenetMutat("Válasszon évet a fenti legördülő menüből.");
});

mindentBetolt();