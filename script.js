const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const fasce = ['Mattina', 'Pomeriggio'];
const container = document.getElementById('giorniContainer');
const cognomeInput = document.getElementById('cognome');
const nomeInput = document.getElementById('nome');
const verificaBtn = document.getElementById('verificaBtn');
const verificaMsg = document.getElementById('verifica-msg');
const submitBtn = document.getElementById('submitBtn');

const disponibilita = new Set();

// Controllo per abilitare il pulsante di verifica solo se entrambi i campi sono compilati
function controllaCampi() {
    verificaBtn.disabled = !(cognomeInput.value.trim() && nomeInput.value.trim());
}

cognomeInput.addEventListener('input', controllaCampi);
nomeInput.addEventListener('input', controllaCampi);

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !verificaBtn.disabled) {
        event.preventDefault();
        verificaBtn.click();
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

        const listaCognomi = datiFoglio.map(riga => Array.isArray(riga) ? String(riga[0]).trim().toLowerCase() : "").filter(Boolean);
        const listaNomi = datiFoglio.map(riga => Array.isArray(riga) ? String(riga[1]).trim().toLowerCase() : "").filter(Boolean);

        console.log("Cognome inserito:", cognome);
        console.log("Nome inserito:", nome);

        const indiceCognome = listaCognomi.findIndex(c => c === cognome);

        if (indiceCognome !== -1 && listaNomi[indiceCognome] === nome) {
            verificaMsg.textContent = 'Cardiologo verificato ✅';
            verificaMsg.style.color = 'green';
            creaFasce();
            container.style.display = 'block';
            submitBtn.style.display = 'inline-block';

            mostraFerieCheckbox(); // Mostriamo la checkbox ferie
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

verificaMsg.after(ferieContainer);
ferieContainer.style.display = 'none'; // Nascondiamo fino alla verifica

// Funzione per gestire la checkbox "FERIE"
ferieCheckbox.addEventListener('change', () => {
    const tutteLeCheckbox = document.querySelectorAll('input[type="checkbox"]');

    if (ferieCheckbox.checked) {
        tutteLeCheckbox.forEach(checkbox => checkbox.style.display = 'none');
        submitBtn.textContent = 'Prosegui';
    } else {
        tutteLeCheckbox.forEach(checkbox => checkbox.style.display = 'inline-block');
        submitBtn.textContent = 'Aggiungi Disponibilità';
    }
});

// Mostrare la checkbox ferie solo dopo la verifica riuscita
function mostraFerieCheckbox() {
    ferieContainer.style.display = 'block';
}
