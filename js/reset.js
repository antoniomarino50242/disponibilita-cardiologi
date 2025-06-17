export function resetDisponibilita() {
  const conferma = confirm("Sei sicuro di voler eliminare tutte le disponibilità?");
  if (!conferma) return;

  document.getElementById('riepilogoLista').innerHTML = '';
  document.getElementById('riepilogo').style.display = 'none';
  document.getElementById('giorniContainer').style.display = 'none';
  document.getElementById('submitBtn').style.display = 'none';
  document.getElementById('verifica-msg').textContent = '';
  document.getElementById('nome').value = '';
  document.getElementById('cognome').value = '';
  document.getElementById('nome').disabled = false;
  document.getElementById('cognome').disabled = false;
  document.getElementById('utenteVerificato').style.display = 'none';
  document.getElementById('nomeCompletoStatico').textContent = '';
  document.getElementById('nomeSection').style.display = 'block';

  const disponibilitaSettimana = document.getElementById('disponibilitaSettimana');
  if (disponibilitaSettimana) {
    disponibilitaSettimana.style.display = 'none';
    const radios = disponibilitaSettimana.querySelectorAll('input[type="radio"]');
    radios.forEach(r => r.checked = false);
  }

  // Riattiva la scritta "Inserire i propri dati per procedere"
  const istruzioni = document.getElementById('istruzioni');
  if (istruzioni) istruzioni.style.display = 'block';
}
