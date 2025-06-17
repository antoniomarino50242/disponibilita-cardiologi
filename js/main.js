import { creaFasce } from './fasce.js';
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

function controllaCampi() {
  console.log("🔍 Controllo campi avviato...");
  const nomeVal = nomeInput.value.trim();
  const cognomeVal = cognomeInput.value.trim();
  console.log(`Nome: ${nomeVal}, Cognome: ${cognomeVal}`);
  verificaBtn.disabled = !(nomeVal && cognomeVal);
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
