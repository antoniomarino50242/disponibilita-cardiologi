export function gestisciRiepilogo(disponibilitaRegistrata) {
  const riepilogoLista = document.getElementById('riepilogoLista');
  const riepilogo = document.getElementById('riepilogo');
  const verificaMsg = document.getElementById('verifica-msg');

  verificaMsg.textContent = '✅ Le disponibilità sono già state inviate. Attendere la riapertura. Ecco il riepilogo delle ultime disponibilità inviate.';
  verificaMsg.style.color = 'blue';

  riepilogoLista.innerHTML = '';

  disponibilitaRegistrata.forEach(entry => {
    const li = document.createElement('li');
    li.className = 'turno';
    li.innerHTML = `<span>${entry.cognome} ${entry.nome}: ${entry.turno} – <em>${entry.annotazione}</em></span>`;

    // 🔥 Pulsante di eliminazione
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌ Cancella';
    deleteBtn.className = 'deleteDisponibilita';
    deleteBtn.onclick = () => {
      li.remove();
    };

    li.appendChild(deleteBtn);
    riepilogoLista.appendChild(li);
  });

  // 🔥 Aggiungi pulsante "Aggiorna Disponibilità"
  aggiungiPulsanteAggiorna();

  riepilogo.style.display = 'block';
}

function aggiungiPulsanteAggiorna() {
  const riepilogo = document.getElementById('riepilogo');

  if (!document.getElementById('aggiornaBtn')) {
    const aggiornaBtn = document.createElement('button');
    aggiornaBtn.textContent = '🔄 Aggiorna Disponibilità';
    aggiornaBtn.id = 'aggiornaBtn';
    aggiornaBtn.className = 'aggiornaDisponibilita';
    aggiornaBtn.onclick = () => aggiornaDisponibilita();

    riepilogo.appendChild(aggiornaBtn);
  }
}

export function gestisciAggiungiDisponibilita() {
  console.log("🔄 Filtraggio delle disponibilità selezionate...");

  const riepilogoLista = document.getElementById('riepilogoLista');
  riepilogoLista.innerHTML = '';

  const disponibilitaSelezionata = [];

  document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
    const turno = checkbox.value;
    const notaTextarea = checkbox.parentElement.querySelector('.annotazione');
    const annotazione = notaTextarea ? notaTextarea.value.trim() : '';

    disponibilitaSelezionata.push({ turno, annotazione });

    const li = document.createElement('li');
    li.className = 'turno';
    li.innerHTML = `<span>${turno} – <em>${annotazione}</em></span>`;

    // 🔥 Aggiungi pulsante di cancellazione
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌ Cancella';
    deleteBtn.className = 'deleteDisponibilita';
    deleteBtn.onclick = () => {
      li.remove();
      disponibilitaSelezionata.splice(disponibilitaSelezionata.findIndex(entry => entry.turno === turno), 1);
    };

    li.appendChild(deleteBtn);
    riepilogoLista.appendChild(li);
  });

  console.log("✅ Disponibilità filtrate:", disponibilitaSelezionata);

  if (disponibilitaSelezionata.length === 0) {
    console.warn("⚠️ Nessuna disponibilità trovata! Assicurati di aver scelto almeno un turno.");
    return null;
  }

  return disponibilitaSelezionata;
}

export async function aggiornaDisponibilita() {
  console.log("🔄 Aggiornamento riepilogo delle disponibilità...");

  const nome = document.getElementById('nomeCardiologo').textContent.trim();
  const cognome = document.getElementById('cognomeCardiologo').textContent.trim();

  const nuoveDisponibilita = gestisciAggiungiDisponibilita(); // 🔥 Recupera solo le selezioni confermate

  if (!nuoveDisponibilita || nuoveDisponibilita.length === 0) {
    console.warn("⚠️ Nessuna disponibilità selezionata!");
    alert("⚠️ Devi selezionare almeno un turno prima di aggiornare!");
    return;
  }

  console.log(`🚀 Eliminazione delle disponibilità precedenti per ${nome} ${cognome}...`);
  await fetch('https://script.google.com/macros/s/...', {
    method: 'DELETE',
    body: JSON.stringify({ cognome, nome }),
    headers: { 'Content-Type': 'application/json' }
  });

  console.log("✅ Vecchie disponibilità cancellate. Ora scrivo le nuove...");
  await fetch('https://withered-grass-db6d.testmedeatelemedicina.workers.dev/', {
    method: 'POST',
    body: JSON.stringify(nuoveDisponibilita.map(entry => ({
      cognome,
      nome,
      turno: entry.turno,
      annotazione: entry.annotazione
    }))),
    headers: { 'Content-Type': 'application/json' }
  });

  console.log("✅ Nuove disponibilità salvate con successo!");
  alert("✅ Le disponibilità sono state aggiornate con successo!");
}

export function preselezionaCheckbox(disponibilitaRegistrata) {
  console.log("🔍 Preselezione delle disponibilità...");

  disponibilitaRegistrata.forEach(entry => {
    const checkbox = document.querySelector(`input[type="checkbox"][value="${entry.turno}"]`);
    if (checkbox) {
      checkbox.checked = true;
      const notaTextarea = checkbox.parentElement.querySelector('.annotazione');
      if (notaTextarea) {
        notaTextarea.value = entry.annotazione || '';
        notaTextarea.style.display = 'block';
      }
    }
  });

  console.log("✅ Preselezione completata!");
}
