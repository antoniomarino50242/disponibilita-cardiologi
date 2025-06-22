let tipologieUtente = []; // <- salva le tipologie trovate alla verifica

import { creaFasce } from './fasce.js';
import { verificaNome } from './verifica.js';
import { gestisciInvio, setupInviaBtnFerie } from './riepilogo.js';
import { resetDisponibilita } from './reset.js';
import { mostraTipologiePerSpecialista } from './tipologie.js';  // nuova import

const verificaBtn = document.getElementById('verificaBtn');
const modulo = document.getElementById('moduloDisponibilita');
const inviaBtn = document.getElementById('inviaBtn');
const inviaBtnFerie = document.getElementById('inviaBtnFerie');
const eliminaBtn = document.getElementById('eliminaBtn');
const nomeInput = document.getElementById('nome');
const cognomeInput = document.getElementById('cognome');
const tipologieContainer = document.getElementById('tipologieContainer');
const giorniContainer = document.getElementById('giorniContainer');
const submitBtn = document.getElementById('submitBtn');
const disponibilitaSettimana = document.getElementById('disponibilitaSettimana');

// Nascondi subito tipologieContainer all’avvio per non mostrare checkbox inutili
tipologieContainer.style.display = 'none';

function controllaCampi() {
  console.log("🔍 Controllo campi avviato...");
  const nomeVal = nomeInput.value.trim();
  const cognomeVal = cognomeInput.value.trim();
  console.log(`Nome: ${nomeVal}, Cognome: ${cognomeVal}`);
  verificaBtn.disabled = !(nomeVal && cognomeVal);
}

// Gestione visibilità form in base a radio "settimana"
function setupRadioDisponibilita() {
  const radioDisponibile = document.querySelector('input[name="settimana"][value="disponibile"]');
  const radioFerie = document.querySelector('input[name="settimana"][value="ferie"]');

  function nascondiTutto() {
    giorniContainer.style.display = 'none';
    submitBtn.style.display = 'none';
    inviaBtnFerie.style.display = 'none';
    tipologieContainer.style.display = 'none';
  }

  nascondiTutto(); // Nascondi tutto all'inizio

  radioDisponibile.addEventListener('change', () => {
    giorniContainer.style.display = 'block';
    submitBtn.style.display = 'inline-block';
    inviaBtnFerie.style.display = 'none';
    tipologieContainer.style.display = 'none'; // Mantieni nascosto il container checkbox
  });

  radioFerie.addEventListener('change', () => {
    giorniContainer.style.display = 'none';
    submitBtn.style.display = 'none';
    inviaBtnFerie.style.display = 'inline-block';
    tipologieContainer.style.display = 'none';
  });
}

// Funzione per mostrare le tipologie recuperate dopo verifica
function mostraTipologie(tipologieAttive) {
  console.log("Chiamata a mostraTipologie con:", tipologieAttive);
  tipologieUtente = tipologieAttive; // <- SALVA le tipologie
  if (tipologieAttive && Array.isArray(tipologieAttive) && tipologieAttive.length > 0) {
    mostraTipologiePerSpecialista(tipologieAttive);
    disponibilitaSettimana.style.display = 'block';
  } else {
    console.warn("Attenzione: tipologieAttive non valide o vuote:", tipologieAttive);
    disponibilitaSettimana.style.display = 'none';
  }
}

// Eventi input per abilitare/disabilitare verifica
nomeInput.addEventListener('input', controllaCampi);
cognomeInput.addEventListener('input', controllaCampi);

// Evento click verificaBtn, ora con Promise per tipologie attive
verificaBtn.addEventListener('click', () => {
  verificaNome()
    .then(tipologieAttive => {
      mostraTipologie(tipologieAttive);
    })
    .catch(err => {
      console.error('Errore verificaNome:', err);
      disponibilitaSettimana.style.display = 'none';
    });
});

modulo.addEventListener('submit', creaFasce);
inviaBtn.addEventListener('click', gestisciInvio);
eliminaBtn.addEventListener('click', resetDisponibilita);

// Setup listener per invia ferie (pulsante che appare solo quando ferie selezionate)
setupInviaBtnFerie();

// Setup radio disponibilità / ferie gestione visibilità form
setupRadioDisponibilita();

// ✅ Esporta la variabile per riepilogo.js
export { tipologieUtente };
