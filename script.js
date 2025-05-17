const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const fasce = ['Mattina', 'Pomeriggio'];
const container = document.getElementById('giorniContainer');
const riepilogoLista = document.getElementById('riepilogoLista');
const riepilogo = document.getElementById('riepilogo');
const modulo = document.getElementById('moduloDisponibilita');
const cognomeInput = document.getElementById('cognome');
const nomeInput = document.getElementById('nome');
const verificaBtn = document.getElementById('verificaBtn');
const verificaMsg = document.getElementById('verifica-msg');
const submitBtn = document.getElementById('submitBtn');
const inviaBtn = document.getElementById('inviaBtn');
const eliminaBtn = document.getElementById('eliminaBtn');
const mainContainer = document.getElementById('mainContainer');
const grazieScreen = document.getElementById('grazieScreen');
const nomeSection = document.getElementById('nomeSection');

const disponibilita = new Set();

// Controllo per abilitare il pulsante di verifica solo se entrambi i campi sono compilati
function controllaCampi() {
  const cognomeVal = cognomeInput.value.trim();
  const nomeVal = nomeInput.value.trim();
  
  verificaBtn.disabled = !(cognomeVal && nomeVal); // Abilita solo se entrambi i campi sono compilati
}

// Assicura che il controllo avvenga su ogni input
cognomeInput.addEventListener('input', controllaCampi);
nomeInput.addEventListener('input', controllaCampi);

// Gestione del tasto INVIO per attivare la verifica
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    if (!verificaBtn.disabled) {
      verificaBtn.click(); // Simula il click sul pulsante
    }
  }
});

function creaFasce() {
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

verificaBtn.addEventListener('click', async () => {
  const cognome = cognomeInput.value.trim().toLowerCase();
  const nome = nomeInput.value.trim().toLowerCase();
  if (!cognome || !nome) return;

  verificaMsg.textContent = 'Verifica in corso...';
  verificaMsg.style.color = '#666';

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbz_4sB7psoyYLQFsgS1vvGT1Q6UoDAEGuFloVFCuQvjqrTBJHF_em-npbDB4GOSJy1mhA/exec');
    const datiFoglio = await response.json();

    console.log("Dati ricevuti dal foglio Google:", datiFoglio);

    // Estrarre correttamente solo le prime due colonne (Cognome e Nome)
    const listaCognomi = datiFoglio.map(riga => Array.isArray(riga) ? String(riga[0]).trim().toLowerCase() : "").filter(Boolean);
    const listaNomi = datiFoglio.map(riga => Array.isArray(riga) ? String(riga[1]).trim().toLowerCase() : "").filter(Boolean);

    console.log("Cognome inserito:", cognome);
    console.log("Nome inserito:", nome);
    console.log("Lista cognomi completa:", listaCognomi);
    console.log("Lista nomi completa:", listaNomi);

    // Trova il cognome nella lista
    const indiceCognome = listaCognomi.findIndex(c => c === cognome);
    console.log("Indice cognome trovato:", indiceCognome);

    // Se il cognome esiste, verifica che il nome corrisponda
    if (indiceCognome !== -1 && listaNomi[indiceCognome] === nome) {
      verificaMsg.textContent = 'Cardiologo verificato ✅';
      verificaMsg.style.color = 'green';
      creaFasce();
      container.style.display = 'block';
      submitBtn.style.display = 'inline-block';
    } else {
      verificaMsg.textContent = 'Cardiologo non trovato. Contattare l’assistenza tecnica ❌';
      verificaMsg.style.color = 'red';
      container.style.display = 'none';
      submitBtn.style.display = 'none';
    }
  } catch (err) {
    verificaMsg.textContent = 'Errore durante la verifica';
    verificaMsg.style.color = 'red';
    console.error("Errore durante la verifica:", err);
  }
});
