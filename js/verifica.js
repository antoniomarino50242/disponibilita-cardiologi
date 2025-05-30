import { creaFasceDynamic } from './utils.js';

export async function verificaNome() {
  const nome = document.getElementById('nome').value.trim();
  const cognome = document.getElementById('cognome').value.trim();
  const verificaMsg = document.getElementById('verifica-msg');
  const loader = document.getElementById('loader');

  if (!nome || !cognome) {
    verificaMsg.textContent = '⚠️ Inserire nome e cognome!';
    verificaMsg.style.color = 'orange';
    return;
  }

  verificaMsg.textContent = 'Verifica in corso...';
  verificaMsg.style.color = '#666';
  loader.style.display = 'block';

  try {
    const response = await fetch('https://script.google.com/macros/s/...'); // URL API da inserire
    if (!response.ok) throw new Error(`Errore API (${response.status})`);

    const lista = await response.json();

    const normalizza = str => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const trovato = lista.some(riga => normalizza(riga[0]) === normalizza(cognome) && normalizza(riga[1]) === normalizza(nome));

    if (trovato) {
      verificaMsg.textContent = '✅ Utente verificato!';
      verificaMsg.style.color = 'green';

      document.getElementById('nomeSection').style.display = 'none';
      document.getElementById('disponibilitaScreen').style.display = 'block';
    } else {
      verificaMsg.textContent = '❌ Utente non trovato';
      verificaMsg.style.color = 'red';
    }
  } catch (err) {
    verificaMsg.textContent = '❌ Errore di verifica';
    verificaMsg.style.color = 'red';
  } finally {
    loader.style.display = 'none';
  }
}
