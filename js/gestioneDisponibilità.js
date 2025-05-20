export function gestisciRiepilogo(disponibilitàRegistrata) {
  const riepilogoLista = document.getElementById('riepilogoLista');
  const riepilogo = document.getElementById('riepilogo');
  const verificaMsg = document.getElementById('verifica-msg');

  verificaMsg.textContent = '✅ Le disponibilità sono già state inviate.';
  verificaMsg.style.color = 'blue';

  riepilogoLista.innerHTML = ''; // Pulizia per evitare doppioni

  disponibilitàRegistrata.forEach(entry => {
    const li = document.createElement('li');
    li.className = 'turno';
    li.innerHTML = `<span>${entry.cognome} ${entry.nome}: ${entry.turno} – <em>${entry.annotazione}</em></span>`;
    riepilogoLista.appendChild(li);
  });

  riepilogo.style.display = 'block';
}

export function preselezionaCheckbox(disponibilitàRegistrata) {
  const giorniContainer = document.getElementById('giorniContainer');
  giorniContainer.innerHTML = '';

  const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const fasce = ['Mattina', 'Pomeriggio'];

  giorni.forEach(giorno => {
    const giornoDiv = document.createElement('div');
    giornoDiv.className = 'giorno';

    const giornoLabel = document.createElement('label');
    giornoLabel.textContent = giorno;
    giornoDiv.appendChild(giornoLabel);

    fasce.forEach(fascia => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `${giorno}-${fascia}`;
      checkbox.name = 'fasce';
      checkbox.value = `${giorno} ${fascia}`;
      
      const selezionato = disponibilitàRegistrata.some(entry => entry.turno === checkbox.value);
      checkbox.checked = selezionato;

      giornoDiv.appendChild(checkbox);
    });

    giorniContainer.appendChild(giornoDiv);
  });

  giorniContainer.style.display = 'block';
}

export async function aggiornaDisponibilità(payload) {
  await fetch('https://api-per-cancellare-disponibilita/', {
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
