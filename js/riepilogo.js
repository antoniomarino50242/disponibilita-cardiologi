export async function gestisciInvio(event) {
  event.preventDefault(); // 🔹 Evitiamo il comportamento predefinito del form

  const cognome = document.getElementById('cognome').value.trim();
  const nome = document.getElementById('nome').value.trim();
  const turno = document.getElementById('turno').value.trim(); // 🔹 Assicuriamoci che il turno venga raccolto!
  const ferieCheckbox = document.getElementById('ferie');
  const ferieSelezionate = ferieCheckbox.checked ? "SI" : ""; // 🔹 Salva "SI" se selezionata

  const payload = {
    cognome: cognome,
    nome: nome,
    turno: turno, // 🔹 Ora il turno viene incluso nel payload correttamente
    ferie: ferieSelezionate
  };

  console.log("📤 Dati inviati:", JSON.stringify(payload));

  await fetch('https://withered-grass-db6d.testmedeatelemedicina.workers.dev/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(response => response.text()).then(data => {
    console.log("✅ Risposta dal server:", data);
  }).catch(error => {
    console.error("❌ Errore nell'invio:", error);
  });
}
