import { creaFasce, creaFasceDynamic } from './fasce.js';
import { verificaNome } from './verifica.js';
import { gestisciInvio, setupInviaBtnFerie } from './riepilogo.js';
import { resetDisponibilita } from './reset.js';

const verificaBtn = document.getElementById('verificaBtn');
const modulo = document.getElementById('moduloDisponibilita');
const inviaBtn = document.getElementById('inviaBtn');
const inviaBtnFerie = document.getElementById('inviaBtnFerie');  // nuovo pulsante ferie
const eliminaBtn = document.getElementById('eliminaBtn');
const nomeInput = document.getElementById('nome');
const cognomeInput = document.getElementById('cognome');
const tipologieContainer = document.getElementById('tipologieContainer');
const giorniContainer = document.getElementById('giorniContainer');
const submitBtn = document.getElementById('submitBtn');
const disponibilitaSettimana = document.getElementById('disponibilitaSettimana');

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
    tipologieContainer.style.display = 'block';

    // Quando seleziono disponibile, creo le fasce dinamicamente
    creaFasceDynamic();

    // Aggiungo listener a checkbox tipologie per rigenerare fasce al cambio selezione
    document.querySelectorAll('input[name="tipologiaCheckbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        creaFasceDynamic();
      });
    });
  });

  radioFerie.addEventListener('change', () => {
    giorniContainer.style.display = 'none';
    submitBtn.style.display = 'none';
    inviaBtnFerie.style.display = 'inline-block';
    tipologieContainer.style.display = 'none';
  });
}

// Eventi input per abilitare/disabilitare verifica
nomeInput.addEventListener('input', controllaCampi);
cognomeInput.addEventListener('input', controllaCampi);

// Eventi click
verificaBtn.addEventListener('click', verificaNome);
modulo.addEventListener('submit', creaFasce);
inviaBtn.addEventListener('click', gestisciInvio);
eliminaBtn.addEventListener('click', resetDisponibilita);

// Setup listener per invia ferie (pulsante che appare solo quando ferie selezionate)
setupInviaBtnFerie();

// Setup radio disponibilità / ferie gestione visibilità form
setupRadioDisponibilita();
