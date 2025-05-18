import { creaFasce } from './fasce.js';
import { verificaNome } from './verifica.js';
import { gestisciInvio } from './riepilogo.js';
import { resetDisponibilita } from './reset.js';

const verificaBtn = document.getElementById('verificaBtn');
const modulo = document.getElementById('moduloDisponibilita');
const inviaBtn = document.getElementById('inviaBtn');
const eliminaBtn = document.getElementById('eliminaBtn');

verificaBtn.addEventListener('click', verificaNome);
modulo.addEventListener('submit', creaFasce);
inviaBtn.addEventListener('click', gestisciInvio);
eliminaBtn.addEventListener('click', resetDisponibilita);
