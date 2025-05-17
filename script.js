verificaBtn.addEventListener('click', async () => {
  const cognome = cognomeInput.value.trim().toLowerCase();
  const nome = nomeInput.value.trim().toLowerCase();
  if (!cognome || !nome) return;

  verificaMsg.textContent = 'Verifica in corso...';
  verificaMsg.style.color = '#666';

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwi9b8hgDuwdp-Vkr0xgkwjw7KG-8K2Wko1ibo4dQEHiEgRYMJum9_2o3WdefffjXEpzg/exec');
    const datiFoglio = await response.json();

    console.log("Dati ricevuti dal foglio Google:", datiFoglio); 

    // Estrarre solo le prime due colonne (Cognome e Nome)
    const listaCognomi = datiFoglio.map(riga => riga[0]?.trim().toLowerCase());
    const listaNomi = datiFoglio.map(riga => riga[1]?.trim().toLowerCase());

    console.log("Cognome inserito:", cognome);
    console.log("Nome inserito:", nome);
    console.log("Lista cognomi:", listaCognomi);
    console.log("Lista nomi:", listaNomi);

    // Trova il cognome nella lista
    const indiceCognome = listaCognomi.indexOf(cognome);
    console.log("Indice cognome trovato:", indiceCognome);

    // Se il cognome esiste, verifica che il nome corrisponda
    if (indiceCognome !== -1 && listaNomi[indiceCognome] === nome) {
      verificaMsg.textContent = 'Cardiologo verificato ✅';
      verificaMsg.style.color = 'green';
      creaFasce();
      container.style.display = 'block';
      submitBtn.style.display = 'inline-block';
    } else {
      verificaMsg.textContent = 'Cardiologo non trovato. Contattare l’assistenza tecnica ❌';
      verificaMsg.style.color = 'red';
      container.style.display = 'none';
      submitBtn.style.display = 'none';
    }
  } catch (err) {
    verificaMsg.textContent = 'Errore durante la verifica';
    verificaMsg.style.color = 'red';
    console.error("Errore durante la verifica:", err);
  }
});
