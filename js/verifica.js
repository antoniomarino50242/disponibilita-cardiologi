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
  const inviaBtnFerie = document.getElementById('inviaBtnFerie');

  if (!nome || !cognome) {
    verificaMsg.textContent = '⚠️ Inserire nome e cognome!';
    verificaMsg.style.color = 'orange';
    return;
  }

  verificaMsg.textContent = 'Verifica in corso...';
  verificaMsg.style.color = '#666';
  loader.style.display = 'block';

  try {
    // 1) Verifica cardiologo esistente
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

    if (!trovato) {
      verificaMsg.textContent = '❌ Cardiologo non trovato';
      verificaMsg.style.color = 'red';
      container.style.display = 'none';
      submitBtn.style.display = 'none';
      disponibilitaSettimana.style.display = 'none';
      inviaBtn.style.display = 'none';
      inviaBtnFerie.style.display = 'none';
      return;
    }

    // 2) Verifica disponibilità
    const checkDispResponse = await fetch(`https://verificadisponibilita.testmedeatelemedicina.workers.dev/?action=checkDisponibilita&nome=${encodeURIComponent(nome)}&cognome=${encodeURIComponent(cognome)}`);
    if (!checkDispResponse.ok) throw new Error(`Errore API Disponibilità (${checkDispResponse.status})`);
    const checkDispData = await checkDispResponse.json();

    if (checkDispData.exists) {
      verificaMsg.textContent = '⚠️ Disponibilità già inviate. Per modifiche contattare l\'assistenza.';
      verificaMsg.style.color = 'orange';

      container.style.display = 'none';
      submitBtn.style.display = 'none';
      disponibilitaSettimana.style.display = 'none';
      inviaBtn.style.display = 'none';
      inviaBtnFerie.style.display = 'none';

      document.getElementById('nome').disabled = true;
      document.getElementById('cognome').disabled = true;

      loader.style.display = 'none';
      return;
    }

    // 3) Verifica tipologia tramite Worker
    try {
      const tipologiaRes = await fetch(`https://tipologiaturni.testmedeatelemedicina.workers.dev/?nome=${encodeURIComponent(nome)}&cognome=${encodeURIComponent(cognome)}`);
      const tipologiaData = await tipologiaRes.json();

      let tipologie = [];

      if (Array.isArray(tipologiaData.tipologie) && tipologiaData.tipologie.length > 0) {
        tipologie = tipologiaData.tipologie;
      } else if (typeof tipologiaData.tipologia === 'string' && tipologiaData.tipologia.trim() !== '') {
        tipologie = tipologiaData.tipologia.split(' - ').map(t => t.trim());
      }

      if (tipologie.length > 0) {
        console.log(`✅ Tipologie trovate per ${nome} ${cognome}:`, tipologie);
        // eventualmente salva o usa tipologie come ti serve
      } else {
        console.warn(`⚠️ Nessuna tipologia assegnata a ${nome} ${cognome}`);
      }
    } catch (tipErr) {
      console.warn('⚠️ Errore nel recupero della tipologia:', tipErr);
    }

    // 4) Prosegui mostrando il form
    verificaMsg.textContent = '✅ Cardiologo verificato!';
    verificaMsg.style.color = 'green';

    document.getElementById('nome').disabled = true;
    document.getElementById('cognome').disabled = true;

    disponibilitaSettimana.style.display = 'block';
    container.style.display = 'none';
    submitBtn.style.display = 'none';
    inviaBtn.style.display = 'none';
    inviaBtnFerie.style.display = 'none';

    document.getElementById('istruzioni').style.display = 'none';

    const radioDisponibile = document.querySelector('input[name="settimana"][value="disponibile"]');
    const radioFerie = document.querySelector('input[name="settimana"][value="ferie"]');

    radioDisponibile.addEventListener('change', () => {
      creaFasceDynamic();
      container.style.display = 'block';
      submitBtn.style.display = 'inline-block';
      inviaBtn.style.display = 'none';
      inviaBtnFerie.style.display = 'none';
    });

    radioFerie.addEventListener('change', () => {
      container.style.display = 'none';
      submitBtn.style.display = 'none';
      inviaBtn.style.display = 'none';
      inviaBtnFerie.style.display = 'inline-block';
    });

  } catch (err) {
    console.error('❌ Errore generale nella verifica:', err);
    verificaMsg.textContent = '❌ Errore nella verifica';
    verificaMsg.style.color = 'red';
    disponibilitaSettimana.style.display = 'none';
    inviaBtn.style.display = 'none';
    inviaBtnFerie.style.display = 'none';
  } finally {
    loader.style.display = 'none';
  }
}
