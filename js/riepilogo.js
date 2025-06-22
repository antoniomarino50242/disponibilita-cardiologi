import { tipologieUtente } from './main.js';

// Funzione per aggiornare il riepilogo con lista turni e aggiungere un solo pulsante
export function aggiornaRiepilogo(listaTurni) {
  const container = document.getElementById('riepilogoLista');
  container.innerHTML = ''; // Pulisce il contenitore

  listaTurni.forEach(turno => {
    const li = document.createElement('li');
    li.className = 'turno';

    // Costruiamo testo base
    const testo = `${turno.cognome} ${turno.nome}: ${turno.turno} – ${turno.annotazione || ''}`;
    li.innerHTML = `<span>${testo}</span>`;

    // Salviamo tipologia nel dataset
    li.dataset.tipologia = turno.tipologia || '';

    // Salviamo numeroMax solo per CONSUNTIVO HC o CONSUNTIVO HP
    if (turno.tipologia === 'CONSUNTIVO HC' || turno.tipologia === 'CONSUNTIVO HP') {
      li.dataset.numeroMax = turno.numeroMax || '';
    } else {
      li.dataset.numeroMax = '';
    }

    container.appendChild(li);
  });
}

// ✅ Funzione unica che gestisce l'invio (normale o ferie)
async function inviaDati(isSoloFerie = false) {
  const nome = document.getElementById('nome').value.trim();
  const cognome = document.getElementById('cognome').value.trim();
  const mainContainer = document.getElementById('mainContainer');
  const grazieScreen = document.getElementById('grazieScreen');

  const payload = [];

  if (isSoloFerie) {
    // ✅ Usa le tipologie trovate in verificaNome
    if (Array.isArray(tipologieUtente) && tipologieUtente.length > 0) {
      tipologieUtente.forEach(tipologia => {
        payload.push({
          cognome,
          nome,
          turno: '',
          annotazione: '',
          tipologia,
          numeroMax: '',
          ferie: true,
          timestamp: new Date().toISOString()
        });
      });
    } else {
      // fallback in caso di errore
      payload.push({
        cognome,
        nome,
        turno: '',
        annotazione: '',
        tipologia: '',
        numeroMax: '',
        ferie: true,
        timestamp: new Date().toISOString()
      });
    }
  } else {
    // Modalità normale: leggi dal riepilogo
    document.querySelectorAll('#riepilogoLista .turno').forEach(li => {
      const testo = li.querySelector('span').innerHTML;
      const [nomeCompleto, resto] = testo.split(':');
      const [turno, notaHtml] = resto.split(' – ');
      const annotazione = notaHtml ? notaHtml.replace(/<\/?em>/g, '').trim() : '';
      const [cognomeParsed, nomeParsed] = nomeCompleto.trim().split(' ');

      const tipologia = li.dataset.tipologia || '';
      const numeroMax = li.dataset.numeroMax || '';

      payload.push({
        cognome: cognomeParsed.trim(),
        nome: nomeParsed.trim(),
        turno: turno.trim(),
        annotazione,
        tipologia,
        numeroMax,
        ferie: '',
        timestamp: new Date().toISOString()
      });
    });
  }

  console.log('Payload da inviare:', payload);

  try {
    const response = await fetch('https://withered-grass-db6d.testmedeatelemedicina.workers.dev/', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Errore invio dati:', response.statusText);
      alert('Errore durante l\'invio dei dati. Riprova più tardi.');
      return;
    }

    console.log('Dati inviati correttamente.');
  } catch (err) {
    console.error('Errore nella fetch:', err);
    alert('Errore di rete durante l\'invio dei dati.');
    return;
  }

  mainContainer.style.display = 'none';
  grazieScreen.style.display = 'block';
  document.getElementById('disponibilitaSettimana').style.display = 'none';
  document.getElementById('istruzioni').style.display = 'none';
}

// 🔘 Listener per pulsante INVIA normale
export function gestisciInvio() {
  const inviaBtn = document.getElementById('inviaBtn');
  inviaBtn.disabled = true;
  inviaBtn.textContent = 'Invio in corso... attendere!';
  inviaDati(false);
}

// 🔘 Listener per pulsante INVIA FERIE
export function setupInviaBtnFerie() {
  const inviaBtnFerie = document.getElementById('inviaBtnFerie');
  if (!inviaBtnFerie) return;

  inviaBtnFerie.addEventListener('click', () => {
    inviaBtnFerie.disabled = true;
    inviaBtnFerie.textContent = 'Invio ferie in corso...';
    inviaDati(true);
  });
}
