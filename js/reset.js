export function resetDisponibilita() {
  const conferma = confirm("Sei sicuro di voler eliminare tutte le disponibilità?");
  if (!conferma) return;

  document.getElementById('riepilogoLista').innerHTML = '';
  document.getElementById('riepilogo').style.display = 'none';
  document.getElementById('giorniContainer').style.display = 'none';
  document.getElementById('submitBtn').style.display = 'none';
  document.getElementById('verifica-msg').textContent = '';
  document.getElementById('nome').value = '';
  document.getElementById('nomeSection').style.display = 'block';
  document.getElementById('disponibilitaSettimana').style.display = 'none';
}
