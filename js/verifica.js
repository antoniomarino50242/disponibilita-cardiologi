import { creaFasceDynamic } from './utils.js';

export async function verificaNome() {
  const nome = document.getElementById('nome').value.trim();
  const cognome = document.getElementById('cognome').value.trim();
  const container = document.getElementById('giorniContainer');
  const verificaMsg = document.getElementById('verifica-msg');
  const submitBtn = document.getElementById('submitBtn');
  const loader = document.getElementById('loader');
  const disponibilitaSettimana = document.getElementById('disponibilitaSettimana');
  const inviaBtn = document.getElementById('inviaBtn');

  if (!nome || !cognome) {
    verificaMsg.textContent = '⚠️ Inserire nome e cognome!';
    verificaMsg.style.color = 'orange';
    return;
  }

  verificaMsg.textContent = 'Verifica in corso...';
  verificaMsg.style.color = '#666';
  loader.style.display = 'block';

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbz9QNa4VSfp8OVLkQmBB9iKZIXnlHH9KJWHpZrskuEexS9_6kqhKPzIqraW-HGzIkh8xA/exec');
    if (!response.ok) throw new Error(`Errore API (${response.status})`);

    const lista = await response.json();

    const normalizza = str =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ').trim();

    const nomeNorm = normalizza(nome);
    const cognomeNorm = normalizza(cognome);

    const trovato = lista.some(riga => {
      if (riga.length < 2) return false;
      const cognomeLista = normalizza(riga[0]);
      const nomeLista = normalizza(riga[1]);
      return nomeLista === nomeNorm && cognomeLista === cognomeNorm;
    });

    if (trovato) {
      verificaMsg.textContent = '✅ Cardiologo verificato!';
      verificaMsg.style.color = 'green';

      document.getElementById('nome').disabled = true;
      document.getElementById('cognome').disabled = true;

      disponibilitaSettimana.style.display = 'block';

      container.style.display = 'none';
      submitBtn.style.display = 'none';
      inviaBtn.style.display = 'none'; // 🔒 Nascondi all'inizio

      const radioDisponibile = document.querySelector('input[name="settimana"][value="disponibile"]');
      const radioFerie = document.querySelector('input[name="settimana"][value="ferie"]');

      radioDisponibile.addEventListener('change', () => {
        creaFasceDynamic();
        container.style.display = 'block';
        submitBtn.style.display = 'inline-block';
        inviaBtn.style.display = 'none';
      });

      radioFerie.addEventListener('change', () => {
        container.style.display = 'none';
        submitBtn.style.display = 'none';
        inviaBtn.style.display = 'inline-block'; // ✅ MOSTRA QUI
      });

    } else {
      verificaMsg.textContent = '❌ Cardiologo non trovato';
      verificaMsg.style.color = 'red';
      container.style.display = 'none';
      submitBtn.style.display = 'none';
      disponibilitaSettimana.style.display = 'none';
      inviaBtn.style.display = 'none';
    }
  } catch (err) {
    console.error('Errore:', err);
    verificaMsg.textContent = '❌ Errore nella verifica';
    verificaMsg.style.color = 'red';
    disponibilitaSettimana.style.display = 'none';
    inviaBtn.style.display = 'none';
  } finally {
    loader.style.display = 'none';
  }
}
