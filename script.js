const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const fasce = ['Mattina', 'Pomeriggio'];
const container = document.getElementById('giorniContainer');
const riepilogoLista = document.getElementById('riepilogoLista');
const riepilogoSection = document.getElementById('riepilogo'); // Sezione riepilogo già presente nella struttura
const cognomeInput = document.getElementById('cognome');
const nomeInput = document.getElementById('nome');
const verificaBtn = document.getElementById('verificaBtn');
const verificaMsg = document.getElementById('verifica-msg');
const submitBtn = document.getElementById('submitBtn');

const disponibilita = new Set();

// **Checkbox "FERIE"**
const ferieContainer = document.createElement('div');
ferieContainer.style.marginTop = '10px';

const ferieCheckbox = document.createElement('input');
ferieCheckbox.type = 'checkbox';
ferieCheckbox.id = 'ferieCheckbox';

const ferieLabel = document.createElement('label');
ferieLabel.textContent = 'Sono in ferie';
ferieLabel.htmlFor = 'ferieCheckbox';

ferieContainer.appendChild(ferieCheckbox);
ferieContainer.appendChild(ferieLabel);

// Aggiungiamo la checkbox "FERIE" dopo la verifica riuscita
verificaMsg.after(ferieContainer);
ferieContainer.style.display = 'none'; // Nascondiamo la checkbox fino alla verifica

// **Gestione del pulsante "Verifica"**
function controllaCampi() {
    verificaBtn.disabled = !(cognomeInput.value.trim() && nomeInput.value.trim());
}

cognomeInput.addEventListener('input', controllaCampi);
nomeInput.addEventListener('input', controllaCampi);

verificaBtn.addEventListener('click', async () => {
    const cognome = cognomeInput.value.trim().toLowerCase();
    const nome = nomeInput.value.trim().toLowerCase();
    if (!cognome || !nome) return;

    verificaMsg.textContent = 'Verifica in corso...';
    verificaMsg.style.color = '#666';

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyUcMJWj1DqqsRvE2ZFlqzkpo2xBKP9hbsLlZqNuJp8LLQy46cgrk-n8XSOpPMWIcFg9A/exec');
        const datiFoglio = await response.json();

        console.log("Dati ricevuti dal foglio Google:", datiFoglio);

        const listaCognomi = datiFoglio.map(riga => Array.isArray(riga) ? String(riga[0]).trim().toLowerCase() : "").filter(Boolean);
        const listaNomi = datiFoglio.map(riga => Array.isArray(riga) ? String(riga[1]).trim().toLowerCase() : "").filter(Boolean);

        const indiceCognome = listaCognomi.findIndex(c => c === cognome);

        if (indiceCognome !== -1 && listaNomi[indiceCognome] === nome) {
            verificaMsg.textContent = 'Cardiologo verificato ✅';
            verificaMsg.style.color = 'green';
            creaFasce();
            container.style.display = 'block';
            submitBtn.style.display = 'inline-block';

            ferieContainer.style.display = 'block'; // Mostriamo la checkbox "FERIE" dopo la verifica
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

// **Gestione della checkbox "FERIE"**
ferieCheckbox.addEventListener('change', () => {
    if (ferieCheckbox.checked) {
        container.style.display = 'none'; // Nasconde la suddivisione dei giorni
        submitBtn.textContent = 'Prosegui';
    } else {
        container.style.display = 'block'; // Mostra la suddivisione dei giorni
        submitBtn.textContent = 'Aggiungi Disponibilità';
    }
});

// **Gestione del pulsante "Aggiungi Disponibilità"**
submitBtn.addEventListener('click', () => {
    riepilogoLista.innerHTML = '';

    const selezioni = document.querySelectorAll('input[name="fasce"]:checked');
    selezioni.forEach(checkbox => {
        const nota = checkbox.parentElement.querySelector('.annotazione textarea').value || 'Nessuna annotazione';
        const item = document.createElement('p');
        item.textContent = `${checkbox.value} - ${nota}`;
        riepilogoLista.appendChild(item);
    });

    // Se ferie è attivo, mostra solo "Sono in ferie"
    if (ferieCheckbox.checked) {
        riepilogoLista.innerHTML = '<p>Il medico è in ferie.</p>';
    }

    riepilogoSection.style.display = 'block'; // Mostriamo il riepilogo
});
