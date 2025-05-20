import { aggiornaDisponibilità } from './gestioneDisponibilità.js';

export async function gestisciInvio() {
  const inviaBtn = document.getElementById('inviaBtn');
  const mainContainer = document.getElementById('mainContainer');
  const grazieScreen = document.getElementById('grazieScreen');

  inviaBtn.disabled = true;
  inviaBtn.textContent = 'Invio in corso... attendere!';

  const payload = [];

  document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
    const giornoFascia = checkbox.value;
    const cognome = document.getElementById('cognome').value.trim();
    const nome = document.getElementById('nome').value.trim();
    
    const notaTextarea = checkbox.parentElement.querySelector('textarea');
    const annotazione = notaTextarea?.value.trim() || '';

    payload.push({
      cognome,
      nome,
      turno: giornoFascia,
      annotazione
    });
  });

  if (payload.length === 0) {
    alert("⚠️ Seleziona almeno una disponibilità prima di inviare!");
    inviaBtn.disabled = false;
    inviaBtn.textContent = "Invia a Medea";
    return;
  }

  await aggiornaDisponibilità(payload);

  mainContainer.style.display = 'none';
  grazieScreen.style.display = 'block';
}
