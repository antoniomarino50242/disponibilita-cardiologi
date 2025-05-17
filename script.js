const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const fasce = ['Mattina', 'Pomeriggio'];
const container = document.getElementById('giorniContainer');
const riepilogoLista = document.getElementById('riepilogoLista');
const riepilogo = document.createElement('div'); // Elemento riepilogo
const cognomeInput = document.getElementById('cognome');
const nomeInput = document.getElementById('nome');
const verificaBtn = document.getElementById('verificaBtn');
const verificaMsg = document.getElementById('verifica-msg');
const submitBtn = document.getElementById('submitBtn');
const inviaBtn = document.createElement('button'); // Pulsante per l'invio

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

verificaMsg.after(ferieContainer);
ferieContainer.style.display = 'none'; // Nascondiamo fino alla verifica

// **Funzione per creare le fasce settimanali**
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

// **Funzione per mostrare la checkbox ferie dopo la verifica**
function mostraFerieCheckbox() {
    ferieContainer.style.display = 'block';
}

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
    riepilogo.innerHTML = '<h3>Riepilogo Disponibilità:</h3>';
    riepilogoLista.innerHTML = '';

    const selezioni = document.querySelectorAll('input[name="fasce"]:checked');
    selezioni.forEach(checkbox => {
        const nota = checkbox.parentElement.querySelector('.annotazione textarea').value || 'Nessuna annotazione';
        riepilogoLista.innerHTML += `<p>${checkbox.value} - ${nota}</p>`;
    });

    // Se ferie è attivo, aggiungiamo la nota
    if (ferieCheckbox.checked) {
        riepilogoLista.innerHTML = '<p>Il medico è in ferie.</p>';
    }

    riepilogo.appendChild(riepilogoLista);
    riepilogo.appendChild(inviaBtn);
    document.body.appendChild(riepilogo);
});

// **Pulsante INVIA a Medea**
inviaBtn.textContent = 'Invia Disponibilità a Medea';
inviaBtn.style.display = 'none';
inviaBtn.addEventListener('click', () => {
    alert('Dati inviati a Medea!');
    riepilogo.style.display = 'none'; // Nasconde il riepilogo dopo l'invio
});
