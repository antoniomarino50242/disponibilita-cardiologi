import { creaFasce } from './fasce.js';
import { verificaNome } from './verifica.js';
import { gestisciInvio } from './riepilogo.js';
import { resetDisponibilita } from './reset.js';

const verificaBtn = document.getElementById('verificaBtn');
const modulo = document.getElementById('moduloDisponibilita');
const inviaBtn = document.getElementById('inviaBtn');
const eliminaBtn = document.getElementById('eliminaBtn');
const nomeInput = document.getElementById('nome');
const cognomeInput = document.getElementById('cognome');
const verificaBtn = document.getElementById('verificaBtn');

function controllaCampi() {
  console.log("🔍 Controllo campi avviato...");
  const nomeVal = nomeInput.value.trim();
  const cognomeVal = cognomeInput.value.trim();
  console.log(`Nome: ${nomeVal}, Cognome: ${cognomeVal}`);
  verificaBtn.disabled = !(nomeVal && cognomeVal);
}

// Controlla ogni volta che l’utente digita qualcosa
nomeInput.addEventListener('input', controllaCampi);
cognomeInput.addEventListener('input', controllaCampi);
verificaBtn.addEventListener('click', verificaNome);
modulo.addEventListener('submit', creaFasce);
inviaBtn.addEventListener('click', gestisciInvio);
eliminaBtn.addEventListener('click', resetDisponibilita);
