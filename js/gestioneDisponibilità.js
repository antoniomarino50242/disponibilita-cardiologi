export function gestisciRiepilogo(disponibilitàRegistrata) {
  const riepilogoLista = document.getElementById('riepilogoLista');
  const riepilogo = document.getElementById('riepilogo');
  const verificaMsg = document.getElementById('verifica-msg');
  const inviaBtn = document.getElementById('inviaBtn');
  const eliminaBtn = document.getElementById('eliminaBtn');

  verificaMsg.textContent = '✅ Le disponibilità sono già state inviate. Attendere la riapertura. Ecco il riepilogo delle ultime disponibilità inviate.';
  verificaMsg.style.color = 'blue';

  riepilogoLista.innerHTML = '';

  disponibilitàRegistrata.forEach(entry => {
    const li = document.createElement('li');
    li.className = 'turno';
    li.innerHTML = `<span>${entry.cognome} ${entry.nome}: ${entry.turno} – <em>${entry.annotazione}</em></span>`;
    riepilogoLista.appendChild(li);
  });

  // Nascondiamo i pulsanti del form
  inviaBtn.style.display = 'none';
  eliminaBtn.style.display = 'none';

  // **Evitiamo la duplicazione del pulsante "Modifica"**
  if (!document.getElementById('modificaBtn')) {
    const modificaBtn = document.createElement('button');
    modificaBtn.textContent = '✏️ Modifica';
    modificaBtn.id = 'modificaBtn';
    modificaBtn.className = 'modificaDisponibilità';
    modificaBtn.style.float = 'right';
    modificaBtn.onclick = () => attivaModificaDisponibilità(disponibilitàRegistrata);

    riepilogo.appendChild(modificaBtn);
  }

  riepilogo.style.display = 'block';
}

export async function invioDatiAMedea(nome, cognome) {
  console.log(`🚀 Eliminazione delle disponibilità precedenti per ${nome} ${cognome}...`);

  await fetch('https://script.google.com/macros/s/AKfycbzmb_VtqcHM_xpch_5sLUx0_pc2kXEEoy7KRamHg2GE88QCe07doUzeUXdJw28oprFBbg/exec', {
    method: 'DELETE',
    body: JSON.stringify({ cognome, nome }),
    headers: { 'Content-Type': 'application/json' }
  });

  console.log("✅ Vecchie disponibilità cancellate. Ora scrivo le nuove...");

  const nuoveDisponibilità = gestisciAggiungiDisponibilità(); // 🔥 Recupera solo le selezioni confermate

  if (nuoveDisponibilità.length === 0) {
    console.warn("⚠️ Nessuna nuova disponibilità da inviare!");
    return;
  }

  await fetch('https://withered-grass-db6d.testmedeatelemedicina.workers.dev/', {
    method: 'POST',
    body: JSON.stringify(nuoveDisponibilità.map(entry => ({
      cognome,
      nome,
      turno: entry.turno,
      annotazione: entry.annotazione
    }))),
    headers: { 'Content-Type': 'application/json' }
  });

  console.log("✅ Nuove disponibilità salvate con successo!");
}

export function attivaModificaDisponibilità(disponibilitàRegistrata) {
  console.log("🔄 Modifica disponibilità attivata"); 

  const riepilogo = document.getElementById('riepilogo');
  const giorniContainer = document.getElementById('giorniContainer');
  const submitBtn = document.getElementById('submitBtn');

  if (!giorniContainer) {
    console.error("❌ Errore: #giorniContainer non trovato!");
    return;
  }

  // **Nascondi il riepilogo e mostra le disponibilità**
  riepilogo.style.display = 'none';
  giorniContainer.style.display = 'block';
  submitBtn.style.display = 'inline-block';

  // 🔥 **Se le checkbox non esistono, le creiamo**
  if (document.querySelectorAll('input[type="checkbox"]').length === 0) {
    creaCheckboxDisponibilità();
  }

  // **Preseleziona le checkbox e annotazioni**
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    const selezionato = disponibilitàRegistrata.some(entry => entry.turno === checkbox.value);
    checkbox.checked = selezionato;

    const notaTextarea = checkbox.parentElement.querySelector('.annotazione');
    const annotazione = disponibilitàRegistrata.find(entry => entry.turno === checkbox.value)?.annotazione || '';

    if (notaTextarea) {
      notaTextarea.value = annotazione;
      notaTextarea.style.display = selezionato ? 'block' : 'none';
    }
  });

  console.log("✅ Modifica pronta, checkbox e annotazioni precompilate!");
}

export function preselezionaCheckbox(disponibilitàRegistrata) {
  const giorniContainer = document.getElementById('giorniContainer');

  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    const selezionato = disponibilitàRegistrata.some(entry => entry.turno === checkbox.value);
    checkbox.checked = selezionato;

    const notaTextarea = checkbox.parentElement.querySelector('textarea');
    const annotazione = disponibilitàRegistrata.find(entry => entry.turno === checkbox.value)?.annotazione || '';
    
    if (notaTextarea) {
      notaTextarea.value = annotazione;
      notaTextarea.style.display = selezionato ? 'block' : 'none';
    }
  });

  giorniContainer.style.display = 'block';
}

function creaCheckboxDisponibilità() {
  console.log("⚙️ Creazione dinamica delle checkbox identiche alle originali");

  const giorniContainer = document.getElementById('giorniContainer');
  if (!giorniContainer) {
    console.error("❌ Errore: #giorniContainer non trovato!");
    return;
  }

  // **Elenco turni disponibili con il SABATO**
  const turniDisponibili = [
    "Lunedì Mattina", "Lunedì Pomeriggio",
    "Martedì Mattina", "Martedì Pomeriggio",
    "Mercoledì Mattina", "Mercoledì Pomeriggio",
    "Giovedì Mattina", "Giovedì Pomeriggio",
    "Venerdì Mattina", "Venerdì Pomeriggio",
    "Sabato Mattina", "Sabato Pomeriggio"
  ];

  // **Svuota il contenitore prima di rigenerarlo**
  giorniContainer.innerHTML = '';

  turniDisponibili.forEach(turno => {
    const divGiorno = document.createElement('div');
    divGiorno.className = 'giorno'; // 🔥 Stessa classe della sezione iniziale

    const label = document.createElement('label');
    label.className = 'fascia-container'; // 🔥 Stessa classe originale

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = turno;
    checkbox.className = 'fascia-checkbox'; // 🔥 Identica a quella iniziale

    const text = document.createElement('span');
    text.textContent = turno;

    const annotazione = document.createElement('textarea');
    annotazione.className = 'annotazione';
    annotazione.placeholder = `Annotazioni per ${turno}`;
    annotazione.style.display = 'none';

    // **Mostra annotazione solo se la checkbox è selezionata**
    checkbox.addEventListener('change', () => {
      annotazione.style.display = checkbox.checked ? 'block' : 'none';
    });

    label.appendChild(checkbox);
    label.appendChild(text);
    divGiorno.appendChild(label);
    divGiorno.appendChild(annotazione);
    giorniContainer.appendChild(divGiorno);
  });

  console.log("✅ Checkbox ricreate con lo stesso stile delle originali!");
}

export async function aggiornaDisponibilità(payload) {
  await fetch('https://script.google.com/macros/s/AKfycbzmb_VtqcHM_xpch_5sLUx0_pc2kXEEoy7KRamHg2GE88QCe07doUzeUXdJw28oprFBbg/exec', {
    method: 'DELETE',
    body: JSON.stringify({ cognome: payload[0].cognome, nome: payload[0].nome }),
    headers: { 'Content-Type': 'application/json' }
  });

  await fetch('https://withered-grass-db6d.testmedeatelemedicina.workers.dev/', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  });
}
export function gestisciAggiungiDisponibilità() {
  console.log("🔄 Filtraggio delle disponibilità selezionate...");

  const riepilogoLista = document.getElementById('riepilogoLista');
  riepilogoLista.innerHTML = ''; // 🔥 Svuota il riepilogo prima di aggiornare

  const disponibilitàSelezionata = [];

  document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
    const turno = checkbox.value;
    const notaTextarea = checkbox.parentElement.querySelector('.annotazione');
    const annotazione = notaTextarea ? notaTextarea.value : '';

    disponibilitàSelezionata.push({ turno, annotazione });

    const li = document.createElement('li');
    li.className = 'turno';
    li.innerHTML = `<span>${turno} – <em>${annotazione}</em></span>`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌ Cancella';
    deleteBtn.className = 'deleteDisponibilità';
    deleteBtn.onclick = () => {
      li.remove();
      disponibilitàSelezionata.splice(disponibilitàSelezionata.findIndex(entry => entry.turno === turno), 1);
    };

    li.appendChild(deleteBtn);
    riepilogoLista.appendChild(li);
  });

  console.log("✅ Disponibilità filtrate:", disponibilitàSelezionata);

  return disponibilitàSelezionata.length > 0 ? disponibilitàSelezionata : null; // 🔥 Se l'array è vuoto, restituisci `null`
}

export async function invioDatiAMedea(nome, cognome) {
  console.log(`🚀 Controllo disponibilità per ${nome} ${cognome}...`);

  const nuoveDisponibilità = gestisciAggiungiDisponibilità();

  if (!nuoveDisponibilità) {
    console.warn("⚠️ Seleziona almeno una disponibilità prima di inviare!");
    return;
  }

  console.log(`🚀 Eliminazione delle disponibilità precedenti per ${nome} ${cognome}...`);

  await fetch('https://script.google.com/macros/s/AKfycbzmb_VtqcHM_xpch_5sLUx0_pc2kXEEoy7KRamHg2GE88QCe07doUzeUXdJw28oprFBbg/exec', {
    method: 'DELETE',
    body: JSON.stringify({ cognome, nome }),
    headers: { 'Content-Type': 'application/json' }
  });

  console.log("✅ Vecchie disponibilità cancellate. Ora scrivo le nuove...");

  await fetch('https://withered-grass-db6d.testmedeatelemedicina.workers.dev/', {
    method: 'POST',
    body: JSON.stringify(nuoveDisponibilità.map(entry => ({
      cognome,
      nome,
      turno: entry.turno,
      annotazione: entry.annotazione
    }))),
    headers: { 'Content-Type': 'application/json' }
  });

  console.log("✅ Nuove disponibilità salvate con successo!");
}
