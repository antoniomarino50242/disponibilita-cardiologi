const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const fasce = ['Mattina', 'Pomeriggio'];
const container = document.getElementById('giorniContainer');
const riepilogoLista = document.getElementById('riepilogoLista');
const riepilogo = document.getElementById('riepilogo');
const modulo = document.getElementById('moduloDisponibilita');
const verificaBtn = document.getElementById('verificaBtn');
const verificaMsg = document.getElementById('verifica-msg');
const submitBtn = document.getElementById('submitBtn');
const inviaBtn = document.getElementById('inviaBtn');
const eliminaBtn = document.getElementById('eliminaBtn');
const mainContainer = document.getElementById('mainContainer');
const grazieScreen = document.getElementById('grazieScreen');
const nomeSection = document.getElementById('nomeSection');

const disponibilita = new Set();

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
ferieContainer.style.display = 'none'; // Nascondiamo la checkbox fino alla verifica

// **Gestione del pulsante "Verifica" con controllo nome e cognome**
verificaBtn.addEventListener('click', async () => {
    const nomeInput = document.getElementById('nome').value.trim();
    if (!nomeInput) return;

    verificaMsg.textContent = 'Verifica in corso...';
    verificaMsg.style.color = '#666';

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyUcMJWj1DqqsRvE2ZFlqzkpo2xBKP9hbsLlZqNuJp8LLQy46cgrk-n8XSOpPMWIcFg9A/exec');
        const lista = await response.json();

        const normalizza = str =>
            str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ').trim();

        const paroleInput = normalizza(nomeInput).split(' ').sort();

        const trovato = lista.some(nomeLista => {
            const paroleLista = normalizza(nomeLista).split(' ').sort();
            return JSON.stringify(paroleInput) === JSON.stringify(paroleLista);
        });

        if (trovato) {
            verificaMsg.textContent = 'Nome verificato ✅';
            verificaMsg.style.color = 'green';
            creaFasce();
            container.style.display = 'block';
            submitBtn.style.display = 'inline-block';
            ferieContainer.style.display = 'block';
        } else {
            verificaMsg.textContent = 'Cardiologo non trovato. Contattare l’assistenza tecnica ❌';
            verificaMsg.style.color = 'red';
            container.style.display = 'none';
            submitBtn.style.display = 'none';
        }
    } catch (err) {
        verificaMsg.textContent = 'Errore durante la verifica';
        verificaMsg.style.color = 'red';
    }
});

// **Gestione del riepilogo con eliminazione giorni**
submitBtn.addEventListener('click', () => {
    riepilogoLista.innerHTML = '';

    const selezioni = document.querySelectorAll('input[name="fasce"]:checked');
    selezioni.forEach(checkbox => {
        const nota = checkbox.parentElement.querySelector('.annotazione textarea').value || 'Nessuna annotazione';
        const item = document.createElement('li');
        item.className = 'turno';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '❌';
        removeBtn.style.marginLeft = '10px';
        removeBtn.addEventListener('click', () => item.remove());

        item.innerHTML = `<span>${checkbox.value} - <em>${nota}</em></span>`;
        item.appendChild(removeBtn);
        riepilogoLista.appendChild(item);
    });

    if (riepilogoLista.hasChildNodes()) {
        riepilogo.style.display = 'block';
        inviaBtn.style.display = 'inline-block';
        eliminaBtn.style.display = 'inline-block';
        nomeSection.style.display = 'none';
    }

    modulo.reset();
    document.querySelectorAll('.annotazione').forEach(div => div.style.display = 'none');
    container.style.display = 'none';
    submitBtn.style.display = 'none';
    verificaMsg.textContent = '';
});

// **Invio dei dati a Medea**
inviaBtn.addEventListener('click', async () => {
    inviaBtn.disabled = true;
    inviaBtn.textContent = 'Invio in corso... attendere!';

    const payload = [];
    document.querySelectorAll('#riepilogoLista .turno').forEach(li => {
        const testo = li.querySelector('span').innerHTML;
        const [nome, resto] = testo.split(':');
        const [turno, notaHtml] = resto.split(' – ');
        const annotazione = notaHtml ? notaHtml.replace(/<\/?em>/g, '').trim() : '';

        payload.push({ nome: nome.trim(), turno: turno.trim(), annotazione });
    });

    await fetch('https://withered-grass-db6d.testmedeatelemedicina.workers.dev/', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    });

    mainContainer.style.display = 'none';
    grazieScreen.style.display = 'block';
});
