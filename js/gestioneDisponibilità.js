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

export function attivaModificaDisponibilità(disponibilitàRegistrata) {
  console.log("🔄 Modifica disponibilità attivata"); 

  const riepilogo = document.getElementById('riepilogo');
  const giorniContainer = document.getElementById('giorniContainer');
  const submitBtn = document.getElementById('submitBtn');

  // **Mostra il container delle disponibilità**
  riepilogo.classList.remove('modifica-attiva');
  giorniContainer.style.display = 'block';
  submitBtn.style.display = 'inline-block';

  // **Preseleziona le checkbox e annotazioni**
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    const selezionato = disponibilitàRegistrata.some(entry => entry.turno === checkbox.value);
    checkbox.checked = selezionato;

    const notaTextarea = checkbox.parentElement.querySelector('.annotazione textarea');
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
