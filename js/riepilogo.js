export async function gestisciInvio() {
  const inviaBtn = document.getElementById('inviaBtn');
  const mainContainer = document.getElementById('mainContainer');
  const grazieScreen = document.getElementById('grazieScreen');

  inviaBtn.disabled = true;
  inviaBtn.textContent = 'Invio in corso... attendere!';

  const payload = [];

  const radioFerie = document.querySelector('input[name="settimana"][value="ferie"]');
  const isFerie = radioFerie && radioFerie.checked;

  if (isFerie) {
    // FERIE selezionato: invia solo nome, cognome, ferie e timestamp
    const nome = document.getElementById('nome').value.trim();
    const cognome = document.getElementById('cognome').value.trim();

    payload.push({
      cognome: cognome,
      nome: nome,
      turno: '',
      annotazione: '',
      ferie: 'FERIE',
      timestamp: new Date().toISOString()
    });

  } else {
    // Modalità normale: invia le fasce selezionate
    document.querySelectorAll('#riepilogoLista .turno').forEach(li => {
      const testo = li.querySelector('span').innerHTML;
      const [nomeCompleto, resto] = testo.split(':'); 
      const [turno, notaHtml] = resto.split(' – ');
      const annotazione = notaHtml ? notaHtml.replace(/<\/?em>/g, '').trim() : '';

      const [cognome, nome] = nomeCompleto.split(' ');

      payload.push({
        cognome: cognome.trim(),
        nome: nome.trim(),
        turno: turno.trim(),
        annotazione: annotazione,
        ferie: '',
        timestamp: new Date().toISOString()
      });
    });
  }

  await fetch('https://withered-grass-db6d.testmedeatelemedicina.workers.dev/', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  mainContainer.style.display = 'none';
  grazieScreen.style.display = 'block';
  document.getElementById('disponibilitaSettimana').style.display = 'none';
}
