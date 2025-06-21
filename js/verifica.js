import {
  creaFasceMattinaPomeriggio,
  creaFasceSoloGiorni,
  creaFasceConMaxEsami
} from './utils.js';

import { mappaTipologie } from './tipologie.js';

function normalizza(str) {
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ' ')
    .trim();
}

function mostraFasceConMessaggi(tipologie) {
  const tipologieContainer = document.getElementById('tipologieContainer');
  const giorniContainer = document.getElementById('giorniContainer');
  tipologieContainer.innerHTML = '';
  giorniContainer.innerHTML = '';

  tipologieContainer.style.display = 'none';

  tipologie.forEach(tip => {
    const key = tip.toLowerCase().trim();
    const info = mappaTipologie[key];
    if (!info) {
      console.warn(`Tipologia sconosciuta: ${tip}`);
      return;
    }

    const blocco = document.createElement('div');
    blocco.className = 'blocco-tipologia';

    const descrizione = document.createElement('p');
    descrizione.textContent = info.testo;
    descrizione.style.fontWeight = 'bold';
    descrizione.style.marginBottom = '8px';
    blocco.appendChild(descrizione);

    switch (key) {
      case 'completo':
      case 'solo ecg':
      case 'ecg 100':
      case 'ecg 75':
        creaFasceMattinaPomeriggio(blocco, `Turno: ${tip}`);
        break;
      case 'turno holter':
      case 'solo hc':
        creaFasceSoloGiorni(blocco, ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'], `Turno: ${tip}`);
        break;
      case 'spirometria consuntivo':
      case 'polisonnografia consuntivo':
        creaFasceSoloGiorni(blocco, ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'], `Turno: ${tip}`);
        break;
      case 'hc consuntivo':
      case 'hp consuntivo':
        creaFasceConMaxEsami(blocco, ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'], `Turno: ${tip}`);
        break;
      default:
        const msg = document.createElement('p');
        msg.textContent = `Tipologia non supportata: ${tip}`;
        blocco.appendChild(msg);
    }

    giorniContainer.appendChild(blocco);
  });

  giorniContainer.style.display = 'block';
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
    const trovato = lista.some(riga =>
      riga.length >= 2 &&
      normalizza(riga[1]) === nomeNorm &&
      normalizza(riga[0]) === cognomeNorm
    );

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

    verificaMsg.textContent = '✅ Cardiologo verificato!';
    verificaMsg.style.color = 'green';
    document.getElementById('nome').disabled = true;
    document.getElementById('cognome').disabled = true;
    disponibilitaSettimana.style.display = 'block';

    const radioDisponibile = document.querySelector('input[name="settimana"][value="disponibile"]');
    const radioFerie = document.querySelector('input[name="settimana"][value="ferie"]');

    radioDisponibile.addEventListener('change', () => {
      if (radioDisponibile.checked) {
        mostraFasceConMessaggi(tipologie);
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

    radioDisponibile.checked = true;
    radioDisponibile.dispatchEvent(new Event('change'));

  } catch (err) {
    console.error('❌ Errore generale nella verifica:', err);
    verificaMsg.textContent = '❌ Errore nella verifica';
    verificaMsg.style.color = 'red';
    disponibilitaSettimana.style.display = 'none';
  } finally {
    loader.style.display = 'none';
  }
}
