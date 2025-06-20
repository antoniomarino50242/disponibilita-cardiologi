export function creaFasceMattinaPomeriggio(wrapper, titolo = '') {
  const fasce = ['Mattina', 'Pomeriggio'];
  if (titolo) {
    const h3 = document.createElement('h3');
    h3.textContent = titolo;
    wrapper.appendChild(h3);
  }

  giorniLunSab().forEach(giorno => {
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
      checkbox.value = `${giorno} ${fascia} (${titolo})`;

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

export function creaFasceSoloGiorni(wrapper, giorni, titolo = '') {
  if (titolo) {
    const h3 = document.createElement('h3');
    h3.textContent = titolo;
    wrapper.appendChild(h3);
  }

  giorni.forEach(giorno => {
    const giornoDiv = document.createElement('div');
    giornoDiv.className = 'giorno';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'fasce';
    checkbox.value = `${giorno} (${titolo})`;

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

export function creaFasceConMaxEsami(wrapper, giorni, titolo = '') {
  if (titolo) {
    const h3 = document.createElement('h3');
    h3.textContent = titolo;
    wrapper.appendChild(h3);
  }

  giorni.forEach(giorno => {
    const giornoDiv = document.createElement('div');
    giornoDiv.className = 'giorno';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'fasce';
    checkbox.value = `${giorno} (${titolo})`;

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

function aggiornaStatoSubmit() {
  const submitBtn = document.getElementById('submitBtn');
  const container = document.getElementById('giorniContainer');
  if (!submitBtn || !container) return;

  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  const almenoUnoSelezionato = Array.from(checkboxes).some(cb => cb.checked);
  submitBtn.disabled = !almenoUnoSelezionato;
}

function giorniLunSab() {
  return ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
}

function giorniCompleti() {
  return ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
}
