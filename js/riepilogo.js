export async function gestisciInvio(event) {
  event.preventDefault(); // 🔹 Evitiamo il comportamento predefinito del form

  const cognome = document.getElementById('cognome').value.trim();
  const nome = document.getElementById('nome').value.trim();
  const ferieCheckbox = document.getElementById('ferie');
  const ferieSelezionate = ferieCheckbox.checked ? "SI" : ""; // 🔹 Salva "SI" se selezionata

  const payload = [];

  document.querySelectorAll('#riepilogoLista .turno').forEach(li => {
    const testo = li.querySelector('span').innerHTML;
    const [nomeCompleto, resto] = testo.split(':'); 
    const [turno, notaHtml] = resto.split(' – ');
    const annotazione = notaHtml ? notaHtml.replace(/<\/?em>/g, '').trim() : '';

    const [cognomeTurno, nomeTurno] = nomeCompleto.split(' ');

    payload.push({
      cognome: cognomeTurno.trim(),
      nome: nomeTurno.trim(),
      turno: turno.trim(),
      annotazione: annotazione,
      ferie: ferieSelezionate // 🔹 Ora il valore delle ferie è separato dal turno!
    });
  });

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
