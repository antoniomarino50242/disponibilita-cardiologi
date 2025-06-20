import { creaFasceDynamic } from './utils.js';

export function creaFasce(event) {
  event.preventDefault();

  const container = document.getElementById('giorniContainer');
  const riepilogoLista = document.getElementById('riepilogoLista');
  const riepilogo = document.getElementById('riepilogo');
  const nome = document.getElementById('nome').value.trim();
  const selezioni = document.querySelectorAll('input[type=checkbox]:checked');
  const disponibilita = new Set();

  selezioni.forEach(c => {
    const chiave = `${nome.toLowerCase()}|${c.value}`;
    if (disponibilita.has(chiave)) return;

    disponibilita.add(chiave);

    const notaTextarea = c.parentElement.querySelector('textarea');
    const nota = notaTextarea?.value.trim() || '';

    const li = document.createElement('li');
    li.className = 'turno';

    const cognome = document.getElementById('cognome').value.trim();
    let testo = `${cognome} ${nome}: ${c.value}`;

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
    document.getElementById('inviaBtn').style.display = 'inline-block';
    document.getElementById('eliminaBtn').style.display = 'inline-block';
    document.getElementById('nomeSection').style.display = 'none';
  
    // 👇 Nasconde la sezione Disponibile/Ferie
    const disponibilitaSettimana = document.getElementById('disponibilitaSettimana');
    if (disponibilitaSettimana) disponibilitaSettimana.style.display = 'none';
  }


  document.getElementById('moduloDisponibilita').reset();
  document.querySelectorAll('.annotazione').forEach(div => div.style.display = 'none');
  container.style.display = 'none';
  document.getElementById('submitBtn').style.display = 'none';
  document.getElementById('verifica-msg').textContent = '';
}
