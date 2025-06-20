export function creaFasceDynamic() {
  const container = document.getElementById('giorniContainer');
  const submitBtn = document.getElementById('submitBtn');  // bottone aggiungi disponibilità

  // Prendi le tipologie selezionate dalle checkbox visibili
  const tipologieCheckbox = Array.from(document.querySelectorAll('input[name="tipologiaCheckbox"]:checked'));
  const tipologieSelezionate = tipologieCheckbox.map(cb => cb.value.toLowerCase());

  container.innerHTML = '';

  if (tipologieSelezionate.length === 0) {
    container.style.display = 'none';
    submitBtn.disabled = true;
    return;
  }

  container.style.display = 'block';

  // Per ogni tipologia selezionata creiamo una sezione separata
  tipologieSelezionate.forEach(tipologia => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('fascia-sezione');

    const titolo = document.createElement('h3');
    titolo.textContent = `Turno: ${tipologia.toUpperCase()}`;
    wrapper.appendChild(titolo);

    container.appendChild(wrapper);

    // Switch in base alla tipologia
    switch(tipologia) {
      case 'completo':
      case 'solo ecg':
      case 'ecg 100':
      case 'ecg 75':
        creaFasceMattinaPomeriggio(wrapper);
        break;

      case 'turno holter':
      case 'holter':
        creaFasceSoloGiorni(wrapper, ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']);
        break;

      case 'spirometria consuntivo':
      case 'polisonnografia consuntivo':
        creaFasceSoloGiorni(wrapper, ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']);
        break;

      case 'hc consuntivo':
      case 'hp consuntivo':
        creaFasceConMaxEsami(wrapper, ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']);
        break;

      default:
        const msg = document.createElement('p');
        msg.textContent = 'Tipologia non ancora supportata.';
        wrapper.appendChild(msg);
    }
  });

  // Aggiorna stato submit in base a tutte le checkbox/fasce create
  function aggiornaStatoSubmit() {
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const almenoUnoSelezionato = Array.from(checkboxes).some(cb => cb.checked);
    submitBtn.disabled = !almenoUnoSelezionato;
  }

  // All’inizio bottone disabilitato
  submitBtn.disabled = true;

  // === FUNZIONI per le varie tipologie ===

  // Turno completo, solo ECG, ecc: giorni + mattina/pomeriggio con annotazioni
  function creaFasceMattinaPomeriggio(wrapper) {
    const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const fasce = ['Mattina', 'Pomeriggio'];

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
        checkbox.id = `${giorno}-${fascia}-${wrapper.textContent}`;
        checkbox.name = 'fasce';
        checkbox.value = `${giorno} ${fascia} (${wrapper.textContent})`;

        const label = document.createElement('label');
        label.textContent = fascia;
        label.htmlFor = checkbox.id;

        const notaCont = document.createElement('div');
        notaCont.className = 'annotazione';
        notaCont.style.display = 'none';

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Annotazioni per questo turno';
        notaCont.appendChild(textarea);

        checkbox.addEventListener('change', () => {
          notaCont.style.display = checkbox.checked ? 'block' : 'none';
          aggiornaStatoSubmit();
        });

        fasciaCont.appendChild(checkbox);
        fasciaCont.appendChild(label);
        fasciaCont.appendChild(notaCont);
        giornoDiv.appendChild(fasciaCont);
      });

      wrapper.appendChild(giornoDiv);
    });
  }

  // Solo giorni, senza mattina/pomeriggio, con annotazioni
  function creaFasceSoloGiorni(wrapper, giorni) {
    giorni.forEach(giorno => {
      const giornoDiv = document.createElement('div');
      giornoDiv.className = 'giorno';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `${giorno}-${wrapper.textContent}`;
      checkbox.name = 'fasce';
      checkbox.value = `${giorno} (${wrapper.textContent})`;

      const label = document.createElement('label');
      label.textContent = giorno;
      label.htmlFor = checkbox.id;

      const notaCont = document.createElement('div');
      notaCont.className = 'annotazione';
      notaCont.style.display = 'none';

      const textarea = document.createElement('textarea');
      textarea.placeholder = 'Annotazioni per questo turno';
      notaCont.appendChild(textarea);

      checkbox.addEventListener('change', () => {
        notaCont.style.display = checkbox.checked ? 'block' : 'none';
        aggiornaStatoSubmit();
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

  // Giorni con campo obbligatorio "numero max esami"
  function creaFasceConMaxEsami(wrapper, giorni) {
    giorni.forEach(giorno => {
      const giornoDiv = document.createElement('div');
      giornoDiv.className = 'giorno';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `${giorno}-${wrapper.textContent}`;
      checkbox.name = 'fasce';
      checkbox.value = `${giorno} (${wrapper.textContent})`;

      const label = document.createElement('label');
      label.textContent = giorno;
      label.htmlFor = checkbox.id;

      // Contenitore annotazioni + max esami
      const notaCont = document.createElement('div');
      notaCont.className = 'annotazione';
      notaCont.style.display = 'none';

      const textarea = document.createElement('textarea');
      textarea.placeholder = 'Annotazioni per questo turno';
      notaCont.appendChild(textarea);

      // Campo numero max esami
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
        aggiornaStatoSubmit();
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
}
