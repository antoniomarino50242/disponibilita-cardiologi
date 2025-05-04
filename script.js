document.addEventListener("DOMContentLoaded", function () {
  const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  const fasce = ["Mattina", "Pomeriggio", "Notte"];
  const giorniContainer = document.getElementById("giorniContainer");
  const riepilogoContainer = document.getElementById("riepilogo");
  const inviaButton = document.getElementById("inviaButton");
  const formContainer = document.getElementById("formContainer");
  const thankYouScreen = document.getElementById("thankYouScreen");
  const nomeInput = document.getElementById("nome");
  const verificaButton = document.getElementById("verificaNome");
  const nomeError = document.getElementById("nomeError");
  const noteInput = document.getElementById("note");
  const nessunTurnoContainer = document.getElementById("nessunTurnoContainer");
  const nessunTurnoCheckbox = document.getElementById("nessunTurno");

  let selections = {};
  let nome = "";

  function creaCheckbox(giorno, fascia) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = `${giorno}-${fascia}`;
    checkbox.dataset.giorno = giorno;
    checkbox.dataset.fascia = fascia;

    checkbox.addEventListener("change", () => {
      aggiornaSelezioni();
      aggiornaRiepilogo();
      aggiornaNessunTurno();
    });

    const label = document.createElement("label");
    label.className = "checkbox-label";
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(fascia));

    return label;
  }

  function aggiornaSelezioni() {
    selections = {};
    const checkboxes = document.querySelectorAll("input[type=checkbox][data-giorno]");
    checkboxes.forEach((cb) => {
      if (cb.checked) {
        const giorno = cb.dataset.giorno;
        const fascia = cb.dataset.fascia;
        if (!selections[giorno]) {
          selections[giorno] = [];
        }
        selections[giorno].push(fascia);
      }
    });
  }

  function aggiornaRiepilogo() {
    riepilogoContainer.innerHTML = "";
    const ul = document.createElement("ul");

    if (nessunTurnoCheckbox.checked) {
      const li = document.createElement("li");
      li.textContent = "Nessun turno disponibile per la prossima settimana.";
      ul.appendChild(li);
    } else {
      Object.entries(selections).forEach(([giorno, fasce]) => {
        const li = document.createElement("li");
        li.textContent = `${giorno}: ${fasce.join(", ")}`;
        ul.appendChild(li);
      });
    }

    riepilogoContainer.appendChild(ul);
  }

  function aggiornaNessunTurno() {
    const selezioniPresenti = Object.keys(selections).length > 0;
    if (!selezioniPresenti) {
      nessunTurnoContainer.style.display = "block";
    } else {
      nessunTurnoContainer.style.display = "none";
      nessunTurnoCheckbox.checked = false;
    }
  }

  function creaFormGiorni() {
    giorni.forEach((giorno) => {
      const divGiorno = document.createElement("div");
      divGiorno.className = "giorno";
      const titolo = document.createElement("h3");
      titolo.textContent = giorno;
      divGiorno.appendChild(titolo);

      fasce.forEach((fascia) => {
        const checkbox = creaCheckbox(giorno, fascia);
        divGiorno.appendChild(checkbox);
      });

      giorniContainer.appendChild(divGiorno);
    });
  }

  verificaButton.addEventListener("click", function () {
    nome = nomeInput.value.trim();
    if (!nome) {
      nomeError.style.display = "block";
      return;
    }

    // Verifica nome via Google Apps Script (opzionale)
    fetch("https://script.google.com/macros/s/...", {
      method: "POST",
      body: new URLSearchParams({ nome }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          nomeError.style.display = "none";
          document.getElementById("schermataNome").style.display = "none";
          document.getElementById("formulario").style.display = "block";
          creaFormGiorni();
        } else {
          nomeError.style.display = "block";
        }
      })
      .catch(() => {
        nomeError.style.display = "block";
      });
  });

  inviaButton.addEventListener("click", function () {
    aggiornaSelezioni();
    aggiornaRiepilogo();
    aggiornaNessunTurno();

    const dati = {
      nome: nome,
      disponibilita: nessunTurnoCheckbox.checked ? "Nessun turno disponibile" : selections,
      note: noteInput.value.trim(),
    };

    fetch("https://script.google.com/macros/s/...", {
      method: "POST",
      body: JSON.stringify(dati),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          formContainer.style.display = "none";
          thankYouScreen.style.display = "flex";
        } else {
          alert("Errore durante l'invio.");
        }
      })
      .catch(() => alert("Errore di rete durante l'invio."));
  });
});
