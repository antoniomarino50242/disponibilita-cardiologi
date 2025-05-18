import { creaFasceDynamic } from './utils.js';

export async function verificaNome() {
  const nome = document.getElementById('nome').value.trim();
  const cognome = document.getElementById('cognome').value.trim();
  const container = document.getElementById('giorniContainer');
  const verificaMsg = document.getElementById('verifica-msg');
  const submitBtn = document.getElementById('submitBtn');
  const procediBtn = document.getElementById('procediBtn');
  const ferieSection = document.getElementById('ferieSection');
  const ferieCheckbox = document.getElementById('ferieCheckbox');
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
    const response = await fetch('https://script.google.com/macros/s/AKfycbzGm7Rbyst8E2hIil_rFl1Dt47RcDElYgNO4sdD-aYntBHCatBbLk8hFBHcMjV39EzYFQ/exec');
    
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

      // 👇 Mostra la checkbox per segnalare ferie
      ferieSection.style.display = 'block';
      ferieCheckbox.checked = false; // Reset della checkbox
      
      container.style.display = 'block';
      submitBtn.style.display = 'inline-block';
      procediBtn.style.display = 'none';
    } else {
      verificaMsg.textContent = '❌ Cardiologo non trovato';
      verificaMsg.style.color = 'red';

      container.style.display = 'none';
      submitBtn.style.display = 'none';
      ferieSection.style.display = 'none';
      procediBtn.style.display = 'none';
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

// 👇 Gestisce la selezione della checkbox "Ferie"
document.getElementById('ferieCheckbox').addEventListener('change', function() {
  const container = document.getElementById('giorniContainer');
  const submitBtn = document.getElementById('submitBtn');
  const procediBtn = document.getElementById('procediBtn');

  if (this.checked) {
    // 👇 Se ferie è spuntato, nasconde i turni e mostra il pulsante "Procedi"
    container.style.display = 'none';
    submitBtn.style.display = 'none';
    procediBtn.style.display = 'inline-block';
  } else {
    // 👇 Se ferie NON è spuntato, mostra i turni e il pulsante "Aggiungi disponibilità"
    container.style.display = 'block';
    submitBtn.style.display = 'inline-block';
    procediBtn.style.display = 'none';
  }
});
