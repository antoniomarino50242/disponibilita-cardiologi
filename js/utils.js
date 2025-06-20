// utils.js

export function creaFasceMattinaPomeriggio(wrapper, titoloTurno) {
  const fasce = ['Mattina', 'Pomeriggio'];
  const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

  const titolo = document.createElement('h3');
  titolo.textContent = titoloTurno;
  wrapper.appendChild(titolo);

  giorni.forEach(giorno => {
    const giornoDiv = document.createElement('div');
    giornoDiv.className = 'giorno';

    const giornoLabel = document.createElement('label');
    giornoLabel.textContent = giorno;
    giornoDiv.appendChild(giornoLabel);

    fasce.forEach(fascia => {
      const fasciaCont = document.createElement('div');
      fasciaCont.className = 'fascia-container';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'fasce';
      checkbox.value = `${giorno} ${fascia} (${titoloTurno})`;

      const label = document.createElement('label');
      label.textContent = fascia;

      const notaCont = document.createElement('div');
      notaCont.className = 'annotazione';
      notaCont.style.display = 'none';

      const textarea = document.createElement('textarea');
      textarea.placeholder = 'Annotazioni per questo turno';
      notaCont.appendChild(textarea);

      checkbox.addEventListener('change', () => {
        notaCont.style.display = checkbox.checked ? 'block' : 'none';
        aggiornaStatoSubmit(wrapper);
      });

      fasciaCont.appendChild(checkbox);
      fasciaCont.appendChild(label);
      fasciaCont.appendChild(notaCont);
      giornoDiv.appendChild(fasciaCont);
    });

    wrapper.appendChild(giornoDiv);
  });
}

export function creaFasceSoloGiorni(wrapper, giorni, titoloTurno) {
  const titolo = document.createElement('h3');
  titolo.textContent = titoloTurno;
  wrapper.appendChild(titolo);

  giorni.forEach(giorno => {
    const giornoDiv = document.createElement('div');
    giornoDiv.className = 'giorno';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'fasce';
    checkbox.value = `${giorno} (${titoloTurno})`;

    const label = document.createElement('label');
    label.textContent = giorno;

    const notaCont = document.createElement('div');
    notaCont.className = 'annotazione';
    notaCont.style.display = 'none';

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Annotazioni per questo turno';
    notaCont.appendChild(textarea);

    checkbox.addEventListener('change', () => {
      notaCont.style.display = checkbox.checked ? 'block' : 'none';
      aggiornaStatoSubmit(wrapper);
    });

    const fasciaCont = document.createElement('div');
    fasciaCont.className = 'fascia-container';
    fasciaCont.appendChild(checkbox);
    fasciaCont.appendChild(label);
    fasciaCont.appendChild(notaCont);

    giornoDiv.appendChild(fasciaCont);
    wrapper.appendChild(giornoDiv);
  });
}

export function creaFasceConMaxEsami(wrapper, giorni, titoloTurno) {
  const titolo = document.createElement('h3');
  titolo.textContent = titoloTurno;
  wrapper.appendChild(titolo);

  giorni.forEach(giorno => {
    const giornoDiv = document.createElement('div');
    giornoDiv.className = 'giorno';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'fasce';
    checkbox.value = `${giorno} (${titoloTurno})`;

    const label = document.createElement('label');
    label.textContent = giorno;

    const notaCont = document.createElement('div');
    notaCont.className = 'annotazione';
    notaCont.style.display = 'none';

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Annotazioni per questo turno';
    notaCont.appendChild(textarea);

    const maxLabel = document.createElement('label');
    maxLabel.textContent = 'Numero max esami inviabili: ';
    maxLabel.style.marginLeft = '1.5rem';

    const maxInput = document.createElement('input');
    maxInput.type = 'number';
    maxInput.min = '1';
    maxInput.placeholder = 'Inserisci numero max';
    maxInput.required = true;
    maxInput.style.width = '120px';

    maxLabel.appendChild(maxInput);
    notaCont.appendChild(maxLabel);

    checkbox.addEventListener('change', () => {
      notaCont.style.display = checkbox.checked ? 'block' : 'none';
      aggiornaStatoSubmit(wrapper);
    });

    const fasciaCont = document.createElement('div');
    fasciaCont.className = 'fascia-container';
    fasciaCont.appendChild(checkbox);
    fasciaCont.appendChild(label);
    fasciaCont.appendChild(notaCont);

    giornoDiv.appendChild(fasciaCont);
    wrapper.appendChild(giornoDiv);
  });
}

export function creaFasceDynamic() {
  const container = document.getElementById('giorniContainer');
  const submitBtn = document.getElementById('submitBtn');
  const tipologieElementi = Array.from(document.querySelectorAll('#tipologieContainer p'));

  container.innerHTML = '';

  const tipologieSelezionate = tipologieElementi.map(p => {
    const testo = p.textContent.toUpperCase();
    if (testo.includes('SOLO ECG')) return 'solo ecg';
    if (testo.includes('ECG 100')) return 'ecg 100';
    if (testo.includes('ECG 75')) return 'ecg 75';
    if (testo.includes('COMPLETO')) return 'completo';
    if (testo.includes('TURNI HOLTER') || testo.includes('SOLO HOLTER')) return 'holter';
    if (testo.includes('HC CONSUNTIVO')) return 'hc consuntivo';
    if (testo.includes('HP CONSUNTIVO')) return 'hp consuntivo';
    if (testo.includes('SPIROMETRIA')) return 'spirometria consuntivo';
    if (testo.includes('POLISONNOGRAFIA')) return 'polisonnografia consuntivo';
    return '';
  }).filter(t => t !== '');

  if (tipologieSelezionate.length === 0) {
    container.style.display = 'none';
    submitBtn.disabled = true;
    return;
  }

  container.style.display = 'block';

  tipologieSelezionate.forEach(tipologia => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('fascia-sezione');

    switch (tipologia) {
      case 'completo':
      case 'solo ecg':
      case 'ecg 100':
      case 'ecg 75':
        creaFasceMattinaPomeriggio(wrapper, `Turno: ${tipologia.toUpperCase()}`);
        break;

      case 'holter':
        creaFasceSoloGiorni(wrapper, giorniCompleti(), `Turno: ${tipologia.toUpperCase()}`);
        break;

      case 'spirometria consuntivo':
      case 'polisonnografia consuntivo':
        creaFasceSoloGiorni(wrapper, giorniLunSab(), `Turno: ${tipologia.toUpperCase()}`);
        break;

      case 'hc consuntivo':
      case 'hp consuntivo':
        creaFasceConMaxEsami(wrapper, giorniLunSab(), `Turno: ${tipologia.toUpperCase()}`);
        break;

      default:
        const msg = document.createElement('p');
        msg.textContent = 'Tipologia non ancora supportata.';
        wrapper.appendChild(msg);
    }

    container.appendChild(wrapper);
  });

  submitBtn.disabled = true;

  function aggiornaStatoSubmit(wrapper) {
    const checkboxes = wrapper.querySelectorAll('input[type="checkbox"]');
    const almenoUnoSelezionato = Array.from(checkboxes).some(cb => cb.checked);
    submitBtn.disabled = !almenoUnoSelezionato;
  }

  function giorniLunSab() {
    return ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  }

  function giorniCompleti() {
    return ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  }
}

/**
 * Funzione esempio per copiare in clipboard le fasce selezionate
 */
export function copiaFasceSelezionate() {
  const checkboxes = document.querySelectorAll('#giorniContainer input[type="checkbox"]:checked');
  if (checkboxes.length === 0) {
    alert('Nessuna fascia selezionata da copiare.');
    return;
  }

  const valori = Array.from(checkboxes).map(cb => cb.value);
  const testoDaCopiare = valori.join('\n');

  navigator.clipboard.writeText(testoDaCopiare)
    .then(() => alert('Fasce selezionate copiate negli appunti!'))
    .catch(() => alert('Errore nella copia negli appunti.'));
}
