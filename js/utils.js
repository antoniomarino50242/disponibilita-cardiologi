export function creaFasceDynamic() {
  const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const fasce = ['Mattina', 'Pomeriggio'];
  const container = document.getElementById('giorniContainer');

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

      checkbox.addEventListener('change', () => {
        notaCont.style.display = checkbox.checked ? 'block' : 'none';
      });

      fasciaCont.appendChild(checkbox);
      fasciaCont.appendChild(label);
      fasciaCont.appendChild(notaCont);
      giornoDiv.appendChild(fasciaCont);
    });

    container.appendChild(giornoDiv);
  });
}
