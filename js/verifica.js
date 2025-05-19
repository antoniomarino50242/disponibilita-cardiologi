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
    
    /*verifica disponibilità già inserite*/
    const responseDisponibilità = await fetch('https://script.google.com/macros/s/AKfycbz9QNa4VSfp8OVLkQmBB9iKZIXnlHH9KJWHpZrskuEexS9_6kqhKPzIqraW-HGzIkh8xA/exec');
    if (!responseDisponibilità.ok) throw new Error(`Errore API (${responseDisponibilità.status})`);
    const datiDisponibilità = await responseDisponibilità.json();
    
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

    console.log("Dati ricevuti dalla disponibilità:", datiDisponibilità); // 🛠 Debug per verificare il formato
    
    const disponibilitàRegistrata = datiDisponibilità.some(riga => {
      if (!riga.cognome || !riga.nome) return false; // 💡 Evita errori se i dati mancano
      const cognomeLista = normalizza(riga.cognome);
      const nomeLista = normalizza(riga.nome);
      return nomeLista === nomeNorm && cognomeLista === cognomeNorm;
    });

    
    const disponibilitàRegistrata = datiDisponibilità.some(riga => {
      if (!riga.cognome || !riga.nome) return false; // 💡 Evita errori se i dati mancano
      const cognomeLista = normalizza(riga.cognome);
      const nomeLista = normalizza(riga.nome);
      return nomeLista === nomeNorm && cognomeLista === cognomeNorm;
    });

    if (!trovato) {
      verificaMsg.textContent = '❌ Cardiologo non trovato';
      verificaMsg.style.color = 'red';
      container.style.display = 'none';
      submitBtn.style.display = 'none';
    } else if (disponibilitàRegistrata) {
      verificaMsg.textContent = '✅ Le disponibilità sono già state inviate. Attendi la riapertura!';
      verificaMsg.style.color = 'blue';
      container.style.display = 'none';
      submitBtn.style.display = 'none';
    } else {
      verificaMsg.textContent = '✅ Cardiologo verificato!';
      verificaMsg.style.color = 'green';
      creaFasceDynamic();
      container.style.display = 'block';
      submitBtn.style.display = 'inline-block';
    }
  } catch (err) {
    console.error('Errore:', err);
    verificaMsg.textContent = '❌ Errore nella verifica';
    verificaMsg.style.color = 'red';
  } finally {
    loader.style.display = 'none';
  }
}
