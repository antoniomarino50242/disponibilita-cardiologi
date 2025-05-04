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
const nomeInput = document.getElementById('nome').value.trim();
if (!nomeInput) return;

verificaMsg.textContent = 'Verifica in corso...';
verificaMsg.style.color = '#666';

try {
const response = await fetch('https://script.google.com/macros/s/AKfycbwi9b8hgDuwdp-Vkr0xgkwjw7KG-8K2Wko1ibo4dQEHiEgRYMJum9\_2o3WdefffjXEpzg/exec');
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

modulo.addEventListener('submit', function(e) {
e.preventDefault();
const nome = document.getElementById('nome').value.trim();
const selezioni = document.querySelectorAll('input\[type=checkbox]\:checked');

selezioni.forEach(c => {
const chiave = `${nome.toLowerCase()}|${c.value}`;
if (disponibilita.has(chiave)) return;

disponibilita.add(chiave);

const notaTextarea = c.parentElement.querySelector('textarea');
const nota = notaTextarea?.value.trim() || '';

const li = document.createElement('li');
li.className = 'turno';

let testo = `${nome}: ${c.value}`;
if (nota) testo += ` – <em>${nota}</em>`;

li.innerHTML = `<span>${testo}</span>`;

const btn = document.createElement('button');
btn.textContent = 'Rimuovi';
btn.className = 'rimuovi';
btn.onclick = () => {
  disponibilita.delete(chiave);
  li.remove();
  if (!riepilogoLista.hasChildNodes()) {
    riepilogo.style.display = 'none';
    inviaBtn.style.display = 'none';
    eliminaBtn.style.display = 'none';
    nomeSection.style.display = 'block';
  }
};

li.appendChild(btn);
riepilogoLista.appendChild(li);

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

inviaBtn.addEventListener('click', async () => {
  // Disabilita il pulsante e mostra il messaggio
  inviaBtn.disabled = true;
  inviaBtn.textContent = 'Invio in corso... attendere!';

  const payload = [];

  document.querySelectorAll('#riepilogoLista .turno').forEach(li => {
    const testo = li.querySelector('span').innerHTML;
    const [nome, resto] = testo.split(':');
    const [turno, notaHtml] = resto.split(' – ');
    const annotazione = notaHtml ? notaHtml.replace(/<\/?em>/g, '').trim() : '';

    payload.push({
      nome: nome.trim(),
      turno: turno.trim(),
      annotazione: annotazione
    });
  });

  await fetch('https://withered-grass-db6d.testmedeatelemedicina.workers.dev/', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Mostra la schermata di ringraziamento
  mainContainer.style.display = 'none';
  grazieScreen.style.display = 'block';
});

eliminaBtn.addEventListener('click', () => {
const conferma = confirm("Sei sicuro di voler eliminare tutte le disponibilità?");
if (!conferma) return;

disponibilita.clear();
riepilogoLista.innerHTML = '';
riepilogo.style.display = 'none';
container.style.display = 'none';
submitBtn.style.display = 'none';
verificaMsg.textContent = '';
document.getElementById('nome').value = '';
nomeSection.style.display = 'block';
});
