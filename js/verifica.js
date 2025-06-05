import { creaFasceDynamic } from './utils.js';

export async function verificaNome() {
  const nome = document.getElementById('nome').value.trim();
  const cognome = document.getElementById('cognome').value.trim();
  const container = document.getElementById('giorniContainer');
  const verificaMsg = document.getElementById('verifica-msg');
  const submitBtn = document.getElementById('submitBtn');
  const loader = document.getElementById('loader'); // 🔥 Loader animato

  if (!nome || !cognome) {
    verificaMsg.textContent = '⚠️ Inserire nome e cognome!';
    verificaMsg.style.color = 'orange';
    return;
  }

  // 👇 Attiva il loader e la verifica
  verificaMsg.textContent = 'Verifica in corso...';
  verificaMsg.style.color = '#666';
  loader.style.display = 'block';

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbz9QNa4VSfp8OVLkQmBB9iKZIXnlHH9KJWHpZrskuEexS9_6kqhKPzIqraW-HGzIkh8xA/exec');
    if (!response.ok) throw new Error(`Errore API (${response.status})`);

    const lista = await response.json(); // Array con [cognome, nome]

    const normalizza = str =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ').trim();

    const nomeNorm = normalizza(nome);
    const cognomeNorm = normalizza(cognome);

    const trovato = lista.some(riga => {
      if (riga.length < 2) return false; // Skip righe incomplete
      const cognomeLista = normalizza(riga[0]);
      const nomeLista = normalizza(riga[1]);
      return nomeLista === nomeNorm && cognomeLista === cognomeNorm;
    });

    if (trovato) {
  verificaMsg.textContent = '✅ Cardiologo verificato!';
  verificaMsg.style.color = 'green';

  // 👇 Mostra scelta disponibilità
  const sceltaDisponibilita = document.getElementById('disponibilitaSettimana');
  sceltaDisponibilita.style.display = 'block';

  // Gestione selezione disponibilità
  const opzioni = document.querySelectorAll('input[name="settimana"]');
    opzioni.forEach(opzione => {
      opzione.addEventListener('change', e => {
        const valore = e.target.value;
        const container = document.getElementById('giorniContainer');
        const submitBtn = document.getElementById('submitBtn');
  
        if (valore === 'disponibile') {
          creaFasceDynamic();
          container.style.display = 'block';
          submitBtn.style.display = 'inline-block';
          document.getElementById('inviaBtn').style.display = 'none';
        } else {
          // FERIE
          container.style.display = 'none';
          submitBtn.style.display = 'none';
          document.getElementById('inviaBtn').style.display = 'inline-block';
  
          // Precarica riepilogo
          const riepilogo = document.getElementById('riepilogo');
          const riepilogoLista = document.getElementById('riepilogoLista');
          riepilogoLista.innerHTML = '';
  
          const li = document.createElement('li');
          const nome = document.getElementById('nome').value.trim();
          const cognome = document.getElementById('cognome').value.trim();
          li.innerHTML = `<span>${cognome} ${nome}: Ferie tutta la settimana</span>`;
          riepilogoLista.appendChild(li);
  
          riepilogo.style.display = 'block';
          document.getElementById('eliminaBtn').style.display = 'inline-block';
          document.getElementById('nomeSection').style.display = 'none';
        }
      });
    });
  } else {
      verificaMsg.textContent = '❌ Cardiologo non trovato';
      verificaMsg.style.color = 'red';
      container.style.display = 'none';
      submitBtn.style.display = 'none';
    }
  } catch (err) {
    console.error('Errore:', err);
    verificaMsg.textContent = '❌ Errore nella verifica';
    verificaMsg.style.color = 'red';
  } finally {
    // 👇 Disattiva il loader al termine della verifica
    loader.style.display = 'none';
  }
}
