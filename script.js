document.addEventListener("DOMContentLoaded", () => {
  const nomeInput = document.getElementById("nome");
  const verificaBtn = document.getElementById("verifica-btn");
  const schermataIniziale = document.getElementById("iniziale");
  const schermataForm = document.getElementById("form-container");
  const schermataFinale = document.getElementById("finale");
  const giorniContainer = document.getElementById("giorni");
  const riepilogoLista = document.getElementById("riepilogo-lista");
  const inviaBtn = document.getElementById("invia-btn");
  const aggiungiBtn = document.getElementById("aggiungi-btn");
  const annotazioni = document.getElementById("annotazioni");
  const nessunaDisponibilita = document.getElementById("nessuna-disponibilita");

  const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  const fasce = ["Mattina", "Pomeriggio", "Notte"];

  let disponibilita = [];

  verificaBtn.addEventListener("click", () => {
    const nome = nomeInput.value.trim();
    if (!nome) {
      alert("Inserisci il tuo nome.");
      return;
    }

    fetch("https://script.google.com/macros/s/AKfycbzle6UqPbTk9F3OHZxAbNzkRikxNqfgm0DPK3g-LDN9AoT7OJk7qStsSFGdMTZHZzJ_IA/exec")
      .then(res => res.json())
      .then(data => {
        if (data.includes(nome)) {
          schermataIniziale.style.display = "none";
          schermataForm.style.display = "block";
        } else {
          alert("Nome non trovato. Assicurati di averlo scritto correttamente.");
        }
      });
  });

  giorni.forEach(giorno => {
    const giornoDiv = document.createElement("div");
    giornoDiv.className = "giorno";

    const label = document.createElement("label");
    label.textContent = giorno;
    giornoDiv.appendChild(label);

    fasce.forEach(fascia => {
      const btn = document.createElement("button");
      btn.textContent = fascia;
      btn.className = "fascia";
      btn.dataset.giorno = giorno;
      btn.dataset.fascia = fascia;
      btn.addEventListener("click", () => {
        btn.classList.toggle("selezionato");
        aggiornaStatoNessunaDisponibilita();
      });
      giornoDiv.appendChild(btn);
    });

    giorniContainer.appendChild(giornoDiv);
  });

  nessunaDisponibilita.addEventListener("click", () => {
    if (nessunaDisponibilita.classList.contains("selezionato")) {
      nessunaDisponibilita.classList.remove("selezionato");
    } else {
      const altriSelezionati = document.querySelectorAll(".fascia.selezionato");
      if (altriSelezionati.length > 0) {
        alert("Deseleziona prima tutte le fasce per indicare che non sarai disponibile.");
        return;
      }
      nessunaDisponibilita.classList.add("selezionato");
    }
  });

  function aggiornaStatoNessunaDisponibilita() {
    const altriSelezionati = document.querySelectorAll(".fascia.selezionato");
    if (altriSelezionati.length > 0) {
      nessunaDisponibilita.classList.remove("selezionato");
      nessunaDisponibilita.style.display = "none";
    } else {
      nessunaDisponibilita.style.display = "block";
    }
  }

  aggiungiBtn.addEventListener("click", () => {
    const nome = nomeInput.value.trim();
    const note = annotazioni.value.trim();

    const selezionati = document.querySelectorAll(".fascia.selezionato");
    const nessuna = nessunaDisponibilita.classList.contains("selezionato");

    if (selezionati.length === 0 && !nessuna) {
      alert("Seleziona almeno una fascia o indica che non sarai disponibile.");
      return;
    }

    if (nessuna) {
      disponibilita.push({ nome, giorno: null, fascia: null, note: "NESSUNA DISPONIBILITÀ" });
      const li = document.createElement("li");
      li.textContent = `${nome}: NESSUNA DISPONIBILITÀ `;
      const btnRimuovi = document.createElement("button");
      btnRimuovi.textContent = "Rimuovi";
      btnRimuovi.addEventListener("click", () => {
        disponibilita = disponibilita.filter(d => !(d.nome === nome && d.note === "NESSUNA DISPONIBILITÀ"));
        li.remove();
        aggiornaStatoNessunaDisponibilita();
      });
      li.appendChild(btnRimuovi);
      riepilogoLista.appendChild(li);
      nessunaDisponibilita.classList.remove("selezionato");
      aggiornaStatoNessunaDisponibilita();
      return;
    }

    selezionati.forEach(btn => {
      const giorno = btn.dataset.giorno;
      const fascia = btn.dataset.fascia;
      disponibilita.push({ nome, giorno, fascia, note });

      const li = document.createElement("li");
      li.textContent = `${nome}: ${giorno} ${fascia} - ${note}`;
      const btnRimuovi = document.createElement("button");
      btnRimuovi.textContent = "Rimuovi";
      btnRimuovi.addEventListener("click", () => {
        disponibilita = disponibilita.filter(d => !(d.nome === nome && d.giorno === giorno && d.fascia === fascia && d.note === note));
        li.remove();
        aggiornaStatoNessunaDisponibilita();
      });
      li.appendChild(btnRimuovi);
      riepilogoLista.appendChild(li);

      btn.classList.remove("selezionato");
    });

    annotazioni.value = "";
    aggiornaStatoNessunaDisponibilita();
  });

  inviaBtn.addEventListener("click", () => {
    const dati = [];
    riepilogoLista.querySelectorAll("li").forEach(li => {
      const testo = li.textContent.replace("Rimuovi", "").trim();
      const [nomeParte, turnoParte] = testo.split(":");

      const nome = nomeParte.trim();
      const resto = turnoParte.trim();

      if (resto === "NESSUNA DISPONIBILITÀ") {
        dati.push({
          nome: nome,
          turno: "NESSUNA DISPONIBILITÀ",
          annotazione: ""
        });
      } else {
        const [giorno, fascia, ...noteArr] = resto.split(" ");
        const nota = noteArr.join(" ").replace("-", "").trim();
        dati.push({
          nome: nome,
          turno: `${giorno}-${fascia}`,
          annotazione: nota
        });
      }
    });

    fetch("https://script.google.com/macros/s/AKfycbzle6UqPbTk9F3OHZxAbNzkRikxNqfgm0DPK3g-LDN9AoT7OJk7qStsSFGdMTZHZzJ_IA/exec", {
      method: "POST",
      body: JSON.stringify(dati),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.text())
      .then(data => {
        schermataForm.style.display = "none";
        schermataFinale.style.display = "block";
      });
  });
});
