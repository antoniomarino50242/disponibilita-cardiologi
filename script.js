const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
const fasce = ["Mattina", "Pomeriggio", "Notte"];
const container = document.getElementById("container");
const submitBtn = document.getElementById("submitBtn");
const riepilogo = document.getElementById("riepilogo");
const riepilogoLista = document.getElementById("riepilogo-lista");
const inviaBtn = document.getElementById("inviaBtn");
const eliminaBtn = document.getElementById("eliminaBtn");
const nomeSection = document.getElementById("nomeSection");
const modulo = document.getElementById("modulo");
const verificaMsg = document.getElementById("verificaMsg");

let disponibilita = new Set();
let nessunaDisponibilitaCheckbox = null;

function creaFasce() {
  container.innerHTML = "";
  giorni.forEach(giorno => {
    const giornoDiv = document.createElement("div");
    giornoDiv.className = "giorno";
    const titolo = document.createElement("h3");
    titolo.textContent = giorno;
    giornoDiv.appendChild(titolo);

    fasce.forEach(fascia => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "fasce";
      checkbox.value = `${giorno}-${fascia}`;

      const nota = document.createElement("input");
      nota.type = "text";
      nota.placeholder = "Annotazioni";
      nota.className = "annotazione";
      nota.name = `nota-${giorno}-${fascia}`;

      const notaCont = document.createElement("div");
      notaCont.className = "nota-container";
      notaCont.appendChild(nota);
      notaCont.style.display = "none";

      checkbox.addEventListener("change", () => {
        notaCont.style.display = checkbox.checked ? "block" : "none";
        aggiornaCheckboxNessuna();
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${fascia}`));
      giornoDiv.appendChild(label);
      giornoDiv.appendChild(notaCont);
    });

    container.appendChild(giornoDiv);
  });

  // Slot "nessuna disponibilità"
  const nessunaDiv = document.createElement('div');
  nessunaDiv.className = 'giorno';

  nessunaDisponibilitaCheckbox = document.createElement('input');
  nessunaDisponibilitaCheckbox.type = 'checkbox';
  nessunaDisponibilitaCheckbox.id = 'nessunaDisponibilita';
  nessunaDisponibilitaCheckbox.name = 'nessunaDisponibilita';

  const nessunaLabel = document.createElement('label');
  nessunaLabel.htmlFor = 'nessunaDisponibilita';
  nessunaLabel.textContent = 'Non avrò turni questa settimana';

  nessunaDiv.appendChild(nessunaDisponibilitaCheckbox);
  nessunaDiv.appendChild(nessunaLabel);
  container.appendChild(nessunaDiv);

  // Nascondi all'inizio
  nessunaDiv.style.display = 'none';
}

function aggiornaCheckboxNessuna() {
  const selezionate = document.querySelectorAll('input[name="fasce"]:checked');
  if (nessunaDisponibilitaCheckbox) {
    nessunaDisponibilitaCheckbox.parentElement.style.display = selezionate.length === 0 ? 'block' : 'none';
    if (selezionate.length > 0) {
      nessunaDisponibilitaCheckbox.checked = false;
    }
  }
}

modulo.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const selezioni = document.querySelectorAll("input[name='fasce']:checked");

  // Se nessuna selezione è attiva e la checkbox "nessuna disponibilità" è spuntata
  if (selezioni.length === 0 && nessunaDisponibilitaCheckbox?.checked) {
    const chiave = `${nome.toLowerCase()}|NESSUNA DISPONIBILITA`;

    if (!disponibilita.has(chiave)) {
      disponibilita.add(chiave);

      const li = document.createElement('li');
      li.className = 'turno';
      li.innerHTML = `<span>${nome}: <strong>NESSUNA DISPONIBILITÀ</strong></span>`;

      const btn = document.createElement('button');
      btn.textContent = 'Rimuovi';
      btn.className = 'rimuovi';
      btn.onclick = () => {
        disponibilita.delete(chiave);
        li.remove();
        riepilogo.style.display = 'none';
        inviaBtn.style.display = 'none';
        eliminaBtn.style.display = 'none';
        nomeSection.style.display = 'block';
      };

      li.appendChild(btn);
      riepilogoLista.appendChild(li);
    }

    riepilogo.style.display = 'block';
    inviaBtn.style.display = 'inline-block';
    eliminaBtn.style.display = 'inline-block';
    nomeSection.style.display = 'none';

    modulo.reset();
    container.style.display = 'none';
    submitBtn.style.display = 'none';
    verificaMsg.textContent = '';
    return;
  }

  selezioni.forEach(sel => {
    const giornoFascia = sel.value.split("-");
    const giorno = giornoFascia[0];
    const fascia = giornoFascia[1];
    const nota = document.querySelector(`input[name='nota-${giorno}-${fascia}']`).value.trim();
    const chiave = `${nome.toLowerCase()}|${giorno}-${fascia}`;

    if (!disponibilita.has(chiave)) {
      disponibilita.add(chiave);

      const li = document.createElement("li");
      li.className = "turno";
      li.innerHTML = `<span>${nome}: ${giorno} ${fascia} ${nota ? "- " + nota : ""}</span>`;

      const btn = document.createElement("button");
      btn.textContent = "Rimuovi";
      btn.className = "rimuovi";
      btn.onclick = () => {
        disponibilita.delete(chiave);
        li.remove();
        riepilogo.style.display = "none";
        inviaBtn.style.display = "none";
        eliminaBtn.style.display = "none";
        nomeSection.style.display = "block";
      };

      li.appendChild(btn);
      riepilogoLista.appendChild(li);
    }
  });

  riepilogo.style.display = "block";
  inviaBtn.style.display = "inline-block";
  eliminaBtn.style.display = "inline-block";
  nomeSection.style.display = "none";

  modulo.reset();
  container.style.display = "none";
  submitBtn.style.display = "none";
  verificaMsg.textContent = "";
});

inviaBtn.addEventListener("click", () => {
  const dati = [];
  riepilogoLista.querySelectorAll("li").forEach(li => {
    const testo = li.textContent.replace("Rimuovi", "").trim();
    const nomeTurno = testo.split(":");
    const nome = nomeTurno[0].trim();
    const resto = nomeTurno[1].trim();
    const [giorno, fascia, ...noteArr] = resto.split(" ");
    const nota = noteArr.join(" ").replace("-", "").trim();
    dati.push({
      nome: nome,
      turno: giorno === "NESSUNA" ? "NESSUNA DISPONIBILITA" : `${giorno}-${fascia}`,
      annotazione: nota
    });
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
      document.getElementById("form-container").style.display = "none";
      document.getElementById("finale").style.display = "block";
    });
});

eliminaBtn.addEventListener("click", () => {
  disponibilita.clear();
  riepilogoLista.innerHTML = "";
  riepilogo.style.display = "none";
  inviaBtn.style.display = "none";
  eliminaBtn.style.display = "none";
  nomeSection.style.display = "block";
});

document.getElementById("verificaNome").addEventListener("click", () => {
  const nome = document.getElementById("nome").value.trim();
  if (nome === "") {
    verificaMsg.textContent = "Inserisci il tuo nome.";
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbzle6UqPbTk9F3OHZxAbNzkRikxNqfgm0DPK3g-LDN9AoT7OJk7qStsSFGdMTZHZzJ_IA/exec?nome=" + encodeURIComponent(nome))
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok") {
        verificaMsg.textContent = "";
        nomeSection.style.display = "none";
        creaFasce();
        container.style.display = "block";
        submitBtn.style.display = "inline-block";
      } else {
        verificaMsg.textContent = "Nome non trovato.";
      }
    });
});
