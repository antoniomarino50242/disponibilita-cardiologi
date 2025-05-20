export function gestisciRiepilogo(disponibilitàRegistrata) {
  const riepilogoLista = document.getElementById('riepilogoLista');
  const riepilogo = document.getElementById('riepilogo');
  const verificaMsg = document.getElementById('verifica-msg');

  verificaMsg.textContent = '✅ Le disponibilità sono già state inviate. Attendere la riapertura. Ecco il riepilogo delle ultime disponibilità inviate.';
  verificaMsg.style.color = 'blue';

  riepilogoLista.innerHTML = '';

  disponibilitàRegistrata.forEach(entry => {
    const li = document.createElement('li');
    li.className = 'turno';
    li.innerHTML = `<span>${entry.cognome} ${entry.nome}: ${entry.turno} – <em>${entry.annotazione}</em></span>`;

    // 🔥 Pulsante di eliminazione per ogni disponibilità
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌ Cancella';
    deleteBtn.className = 'deleteDisponibilità';
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
    aggiornaBtn.className = 'aggiornaDisponibilità';
    aggiornaBtn.onclick = () => aggiornaDisponibilità();

    riepilogo.appendChild(aggiornaBtn);
  }
}

export function gestisciAggiungiDisponibilità() {
  console.log("🔄 Filtraggio delle disponibilità selezionate...");

  const riepilogoLista = document.getElementById('riepilogoLista');
  riepilogoLista.innerHTML = '';

  const disponibilitàSelezionata = [];

  document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
    const turno = checkbox.value;
    const notaTextarea = checkbox.parentElement.querySelector('.annotazione');
    const annotazione = notaTextarea ? notaTextarea.value.trim() : '';

    disponibilitàSelezionata.push({ turno, annotazione });

    const li = document.createElement('li');
    li.className = 'turno';
    li.innerHTML = `<span>${turno} – <em>${annotazione}</em></span>`;

    // 🔥 Aggiungi pulsante di cancellazione per ogni disponibilità
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

  if (disponibilitàSelezionata.length === 0) {
    console.warn("⚠️ Nessuna disponibilità trovata! Assicurati di aver scelto almeno un turno.");
    return null;
  }

  return disponibilitàSelezionata;
}

export async function aggiornaDisponibilità() {
  console.log("🔄 Aggiornamento riepilogo delle disponibilità...");

  const nome = document.getElementById('nomeCardiologo').textContent.trim();
  const cognome = document.getElementById('cognomeCardiologo').textContent.trim();

  const nuoveDisponibilità = gestisciAggiungiDisponibilità(); // 🔥 Recupera solo le selezioni confermate

  if (!nuoveDisponibilità || nuoveDisponibilità.length === 0) {
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
    body: JSON.stringify(nuoveDisponibilità.map(entry => ({
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
