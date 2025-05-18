export async function gestisciInvio() {
  const inviaBtn = document.getElementById('inviaBtn');
  const mainContainer = document.getElementById('mainContainer');
  const grazieScreen = document.getElementById('grazieScreen');

  inviaBtn.disabled = true;
  inviaBtn.textContent = 'Invio in corso... attendere!';

  const payload = [];

  document.querySelectorAll('#riepilogoLista .turno').forEach(li => {
  const testo = li.querySelector('span').innerHTML;
  const [nomeCompleto, resto] = testo.split(':');  // 👈 Cambia da nome → nomeCompleto
  const [turno, notaHtml] = resto.split(' – ');
  const annotazione = notaHtml ? notaHtml.replace(/<\/?em>/g, '').trim() : '';

  payload.push({
    nome: nomeCompleto.trim(),  // 👈 Ora prende anche il cognome!
    turno: turno.trim(),
    annotazione: annotazione
  });
});


  await fetch('https://withered-grass-db6d.testmedeatelemedicina.workers.dev/', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  mainContainer.style.display = 'none';
  grazieScreen.style.display = 'block';
}
