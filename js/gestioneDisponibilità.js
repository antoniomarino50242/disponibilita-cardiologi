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

  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    const selezionato = disponibilitàRegistrata.some(entry => entry.turno === checkbox.value);
    checkbox.checked = selezionato;

    // Trova l'annotazione corrispondente e precompilala
    const notaTextarea = checkbox.parentElement.querySelector('textarea');
    const annotazione = disponibilitàRegistrata.find(entry => entry.turno === checkbox.value)?.annotazione || '';
    
    if (notaTextarea) {
      notaTextarea.value = annotazione;
      notaTextarea.style.display = selezionato ? 'block' : 'none';
    }
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
