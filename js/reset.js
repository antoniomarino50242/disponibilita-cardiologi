export function resetDisponibilita() {
  if (confirm("Sei sicuro di voler eliminare tutte le disponibilità?")) {
    location.reload();
  }
}
