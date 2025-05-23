import { creaFasceDynamic } from './utils.js';
import { gestisciRiepilogo, preselezionaCheckbox } from './gestioneDisponibilita.js';

export async function verificaNome() {
  const nome = document.getElementById('nome').value.trim();
  const cognome = document.getElementById('cognome').value.trim();
  const container = document.getElementById('giorniContainer');
  const verificaMsg = document.getElementById('verifica-msg');
  const submitBtn = document.getElementById('submitBtn');
  const riepilogoLista = document.getElementById('riepilogoLista');
  const riepilogo = document.getElementById('riepilogo');
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
    const responseLista = await fetch('https://script.google.com/macros/s/AKfycbz9QNa4VSfp8OVLkQmBB9iKZIXnlHH9KJWHpZrskuEexS9_6kqhKPzIqraW-HGzIkh8xA/exec');
    if (!responseLista.ok) throw new Error(`Errore API (${responseLista.status})`);
    const lista = await responseLista.json();
    
    /* verifica disponibilità già inserite */
    const responseDisponibilità = await fetch('https://script.google.com/macros/s/AKfycbyMlUN3lH2tp5ZlcWvELAz2KlMD0JLhy9L4DyDf4L4eym94-dkhfGrkKOJ025_e55WrNg/exec');
    if (!responseDisponibilità.ok) throw new Error(`Errore API (${responseDisponibilità.status})`);
    const datiDisponibilità = await responseDisponibilità.json();
    
    const normalizza = str =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ').trim();

    const nomeNorm = normalizza(nome);
    const cognomeNorm = normalizza(cognome);

    const trovato = lista.some(riga => normalizza(riga[0]) === cognomeNorm && normalizza(riga[1]) === nomeNorm);
    
    console.log("Dati ricevuti dalla disponibilità:", JSON.stringify(datiDisponibilità, null, 2)); // 🛠 Debug per verificare il formato

    const disponibilitàRegistrata = datiDisponibilità.filter(riga => 
      normalizza(riga.cognome) === cognomeNorm && normalizza(riga.nome) === nomeNorm
    );

    if (!trovato) {
      verificaMsg.textContent = '❌ Cardiologo non trovato';
      verificaMsg.style.color = 'red';
      container.style.display = 'none';
      submitBtn.style.display = 'none';
    } else if (disponibilitàRegistrata.length > 0) {
      verificaMsg.textContent = '✅ Le disponibilità sono già state inviate.';
      verificaMsg.style.color = 'blue';

      gestisciRiepilogo(disponibilitàRegistrata);
      preselezionaCheckbox(disponibilitàRegistrata);
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
