export function creaFasceDynamic() {
  const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const fasce = ['Mattina', 'Pomeriggio'];
  const container = document.getElementById('giorniContainer');
  const submitBtn = document.getElementById('submitBtn');  // bottone aggiungi disponibilità

  container.innerHTML = '';

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
      checkbox.id = `${giorno}-${fascia}`;
      checkbox.name = 'fasce';
      checkbox.value = `${giorno} ${fascia}`;

      const label = document.createElement('label');
      label.textContent = fascia;
      label.htmlFor = checkbox.id;

      const notaCont = document.createElement('div');
      notaCont.className = 'annotazione';

      const textarea = document.createElement('textarea');
      textarea.placeholder = 'Annotazioni per questo turno';
      notaCont.appendChild(textarea);

      // Aggiunta la chiamata per aggiornare lo stato del bottone
      checkbox.addEventListener('change', () => {
        notaCont.style.display = checkbox.checked ? 'block' : 'none';
        aggiornaStatoSubmit();
      });

      fasciaCont.appendChild(checkbox);
      fasciaCont.appendChild(label);
      fasciaCont.appendChild(notaCont);
      giornoDiv.appendChild(fasciaCont);
    });

    container.appendChild(giornoDiv);
  });

  // Funzione che abilita/disabilita il bottone aggiungi disponibilità
  function aggiornaStatoSubmit() {
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const almenoUnoSelezionato = Array.from(checkboxes).some(cb => cb.checked);
    submitBtn.disabled = !almenoUnoSelezionato;
  }

  // Disabilita subito il bottone, perché all'inizio non c'è nulla selezionato
  submitBtn.disabled = true;
}
