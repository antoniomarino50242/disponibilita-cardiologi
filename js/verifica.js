import { creaFasceDynamic } from './utils.js';
import { mappaTipologie } from './tipologie.js';

function normalizza(str) {
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ' ')
    .trim();
}

// Mostra i messaggi delle tipologie assegnate
function mostraMessaggiTipologie(tipologie) {
  const container = document.getElementById('tipologieContainer');
  container.innerHTML = '';
  if (!tipologie || tipologie.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  tipologie.forEach(tip => {
    const key = tip.toLowerCase().trim();
    if (!(key in mappaTipologie)) {
      console.warn(`Tipologia sconosciuta: ${tip}`);
      return;
    }

    const info = mappaTipologie[key];

    const descrizione = document.createElement('p');
    descrizione.textContent = info.testo;
    descrizione.style.fontWeight = 'bold';
    descrizione.style.marginBottom = '12px';
    container.appendChild(descrizione);
  });
}

export async function verificaNome() {
  const nome = document.getElementById('nome').value.trim();
  const cognome = document.getElementById('cognome').value.trim();
  const container = document.getElementById('giorniContainer');
  const verificaMsg = document.getElementById('verifica-msg');
  const submitBtn = document.getElementById('submitBtn');
  const loader = document.getElementById('loader');
  const disponibilitaSettimana = document.getElementById('disponibilitaSettimana');
  const inviaBtn = document.getElementById('inviaBtn');
  const inviaBtnFerie = document.getElementById('inviaBtnFerie');
  const tipologieContainer = document.getElementById('tipologieContainer');

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

    const nomeNorm = normalizza(nome);
    const cognomeNorm = normalizza(cognome);
    const trovato = lista.some(riga => {
      if (riga.length < 2) return false;
      return normalizza(riga[1]) === nomeNorm && normalizza(riga[0]) === cognomeNorm;
    });

    if (!trovato) {
      verificaMsg.textContent = '❌ Cardiologo non trovato';
      verificaMsg.style.color = 'red';
      disponibilitaSettimana.style.display = 'none';
      tipologieContainer.style.display = 'none';
      container.style.display = 'none';
      submitBtn.style.display = 'none';
      inviaBtn.style.display = 'none';
      inviaBtnFerie.style.display = 'none';
      return;
    }

    const checkDispResponse = await fetch(`https://verificadisponibilita.testmedeatelemedicina.workers.dev/?action=checkDisponibilita&nome=${encodeURIComponent(nome)}&cognome=${encodeURIComponent(cognome)}`);
    if (!checkDispResponse.ok) throw new Error(`Errore API Disponibilità (${checkDispResponse.status})`);
    const checkDispData = await checkDispResponse.json();

    if (checkDispData.exists) {
      verificaMsg.textContent = '⚠️ Disponibilità già inviate. Per modifiche contattare l\'assistenza.';
      verificaMsg.style.color = 'orange';
      disponibilitaSettimana.style.display = 'none';
      tipologieContainer.style.display = 'none';
      container.style.display = 'none';
      submitBtn.style.display = 'none';
      inviaBtn.style.display = 'none';
      inviaBtnFerie.style.display = 'none';
      document.getElementById('nome').disabled = true;
      document.getElementById('cognome').disabled = true;
      return;
    }

    // Recupera le tipologie associate
    let tipologie = [];
    try {
      const tipologiaRes = await fetch(`https://tipologiaturni.testmedeatelemedicina.workers.dev/?nome=${encodeURIComponent(nome)}&cognome=${encodeURIComponent(cognome)}`);
      const tipologiaData = await tipologiaRes.json();

      if (Array.isArray(tipologiaData.tipologie)) {
        tipologie = tipologiaData.tipologie;
      } else if (typeof tipologiaData.tipologia === 'string') {
        tipologie = tipologiaData.tipologia.split(' - ').map(t => t.trim());
      }

      console.log(`✅ Tipologie trovate per ${nome} ${cognome}:`, tipologie);
    } catch (err) {
      console.warn('⚠️ Errore nel recupero della tipologia:', err);
    }

    // ✅ Mostra radio disponibile/ferie
    disponibilitaSettimana.style.display = 'block';
    document.getElementById('nome').disabled = true;
    document.getElementById('cognome').disabled = true;

    // Listener dei radio
    const radioDisponibile = document.querySelector('input[name="settimana"][value="disponibile"]');
    const radioFerie = document.querySelector('input[name="settimana"][value="ferie"]');

    radioDisponibile.addEventListener('change', () => {
      if (radioDisponibile.checked) {
        mostraMessaggiTipologie(tipologie);
        tipologieContainer.style.display = 'block';
        creaFasceDynamic(); // crea direttamente tutte le fasce
        container.style.display = 'block';
        submitBtn.style.display = 'inline-block';
        inviaBtn.style.display = 'none';
        inviaBtnFerie.style.display = 'none';
      }
    });

    radioFerie.addEventListener('change', () => {
      container.style.display = 'none';
      tipologieContainer.style.display = 'none';
      submitBtn.style.display = 'none';
      inviaBtn.style.display = 'none';
      inviaBtnFerie.style.display = 'inline-block';
    });

    // Imposta default su "disponibile"
    radioDisponibile.checked = true;
    radioDisponibile.dispatchEvent(new Event('change'));

    verificaMsg.textContent = '✅ Cardiologo verificato!';
    verificaMsg.style.color = 'green';

  } catch (err) {
    console.error('❌ Errore generale nella verifica:', err);
    verificaMsg.textContent = '❌ Errore nella verifica';
    verificaMsg.style.color = 'red';
    disponibilitaSettimana.style.display = 'none';
  } finally {
    loader.style.display = 'none';
  }
}
