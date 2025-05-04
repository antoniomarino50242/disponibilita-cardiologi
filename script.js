const giorniSettimana = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
const fasceOrarie = ["Mattina", "Pomeriggio"];

document.addEventListener("DOMContentLoaded", () => {
  const schermataNome = document.getElementById("schermataNome");
  const formulario = document.getElementById("formulario");
  const schermataFinale = document.getElementById("schermataFinale");
  const nomeInput = document.getElementById("nome");
  const verificaBtn = document.getElementById("verificaNome");
  const nomeUtente = document.getElementById("nomeUtente");
  const giorniContainer = document.getElementById("giorniContainer");
  const modulo = document.getElementById("moduloDisponibilità");
  const nomeError = document.getElementById("nomeError");
  const indietroBtn = document.getElementById("indietro");
  const nessunaDispCheckbox = document.getElementById("nessunaDisponibilità");
  const nessunaDispContainer = document.getElementById("nessunaDisponibilitàContainer");

  // Verifica nome
  verificaBtn.addEventListener("click", () => {
    const nome = nomeInput.value.trim();
    nomeError.textContent = "";

    if (!nome) {
      nomeError.textContent = "Inserisci un nome.";
      return;
    }

    fetch("https://script.google.com/macros/s/AKfycbxYxxYOtUAz5CkW1oEQu0ZztdOwA2gZSnH0LZDEoU39qa7FA3jLDeOau_sF0JuVXyEy/exec?nome=" + encodeURIComponent(nome))
      .then(response => response.json())
      .then(data => {
        if (data.trovato) {
          schermataNome.style.display = "none";
          formulario.style.display = "block";
          nomeUtente.textContent = nome;
          generaCheckbox();
        } else {
          nomeError.textContent = "Nome non trovato. Contatta il coordinatore.";
        }
      })
      .catch(error => {
        nomeError.textContent = "Errore di rete. Riprova.";
        console.error("Errore:", error);
      });
  });

  function generaCheckbox() {
    giorniContainer.innerHTML = "";

    giorniSettimana.forEach(giorno => {
      const giornoDiv = document.createElement("div");
      giornoDiv.classList.add("giorno");

      const giornoLabel = document.createElement("label");
      giornoLabel.textContent = giorno;
      giornoDiv.appendChild(giornoLabel);

      fasceOrarie.forEach(fascia => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = giorno;
        checkbox.value = fascia;
        checkbox.classList.add("fascia-checkbox");

        checkbox.addEventListener("change", aggiornaStatoDisponibilità);

        const label = document.createElement("label");
        label.appendChild(checkbox);
        label.append(" " + fascia);

        giornoDiv.appendChild(label);
      });

      giorniContainer.appendChild(giornoDiv);
    });

    aggiornaStatoDisponibilità(); // Verifica iniziale
  }

  function aggiornaStatoDisponibilità() {
    const tutteFasce = document.querySelectorAll(".fascia-checkbox");
    const almenoUnaSelezionata = Array.from(tutteFasce).some(cb => cb.checked);
    nessunaDispContainer.style.display = almenoUnaSelezionata ? "none" : "block";
    if (almenoUnaSelezionata) {
      nessunaDispCheckbox.checked = false;
    }
  }

  modulo.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = nomeUtente.textContent;
    const note = document.getElementById("note").value.trim();
    const selezioni = {};

    const tutteFasce = document.querySelectorAll(".fascia-checkbox");

    tutteFasce.forEach(cb => {
      if (cb.checked) {
        if (!selezioni[cb.name]) selezioni[cb.name] = [];
        selezioni[cb.name].push(cb.value);
      }
    });

    const nessunaDisponibilità = nessunaDispCheckbox.checked;

    const dati = {
      nome,
      disponibilità: selezioni,
      nessunaDisponibilità,
      note
    };

    fetch("https://script.google.com/macros/s/AKfycbxYxxYOtUAz5CkW1oEQu0ZztdOwA2gZSnH0LZDEoU39qa7FA3jLDeOau_sF0JuVXyEy/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dati)
    })
      .then(res => res.json())
      .then(() => {
        formulario.style.display = "none";
        schermataFinale.style.display = "flex";
      })
      .catch(error => {
        alert("Errore durante l'invio. Riprova.");
        console.error("Errore:", error);
      });
  });

  indietroBtn.addEventListener("click", () => {
    formulario.style.display = "none";
    schermataNome.style.display = "flex";
    nomeInput.value = "";
    nomeUtente.textContent = "";
  });
});
