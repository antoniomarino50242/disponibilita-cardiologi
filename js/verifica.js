import { creaFasceDynamic } from './utils.js';

export async function verificaNome() {
  const nome = document.getElementById('nome').value.trim();
  const cognome = document.getElementById('cognome').value.trim();
  const container = document.getElementById('giorniContainer');
  const verificaMsg = document.getElementById('verifica-msg');
  const submitBtn = document.getElementById('submitBtn');
  const riepilogoLista = document.getElementById('riepilogoLista');
  const riepilogo = document.getElementById('riepilogo');
  const loader = document.getElementById('loader');

  if (!nome || !cognome) {
    verificaMsg.textContent = '⚠️ Inserire nome e cognome!';
    verificaMsg.style.color = 'orange';
    return;
  }

  verificaMsg.textContent = 'Verifica in corso...';
  verificaMsg.style.color = '#666';
  loader.style.display = 'block';

  try {
    const responseLista = await fetch('https://script.google.com/macros/s/AKfycbz9QNa4VSfp8OVLkQmBB9iKZIXnlHH9KJWHpZrskuEexS9_6kqhKPzIqraW-HGzIkh8xA/exec');
    if (!responseLista.ok) throw new Error(`Errore API (${responseLista.status})`);
    const lista = await responseLista.json();
    
    const responseDisponibilità = await fetch('https://script.google.com/macros/s/AKfycbxGBHEBZ_HPWAKqXW8k9ZLUcrjaENu9m9ESUAx8f-zcaD-upohL9F-P-969B6a02kXEbw/exec');
    if (!responseDisponibilità.ok) throw new Error(`Errore API (${responseDisponibilità.status})`);
    const datiDisponibilità = await responseDisponibilità.json();
    
    const normalizza = str =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ').trim();

    const nomeNorm = normalizza(nome);
    const cognomeNorm = normalizza(cognome);

    const trovato = lista.some(riga => normalizza(riga[0]) === cognomeNorm && normalizza(riga[1]) === nomeNorm);
    
    console.log("Dati ricevuti dalla disponibilità:", JSON.stringify(datiDisponibilità, null, 2));

    const disponibilitàRegistrata = datiDisponibilità.filter(riga => 
      normalizza(riga.cognome) === cognomeNorm && normalizza(riga.nome) === nomeNorm
    );

    if (!trovato) {
      verificaMsg.textContent = '❌ Cardiologo non trovato';
      verificaMsg.style.color = 'red';
      container.style.display = 'none';
      submitBtn.style.display = 'none';
    } else if (disponibilitàRegistrata.length > 0) {
      verificaMsg.textContent = '✅ Le disponibilità sono già state inviate. Ecco il riepilogo:';
      verificaMsg.style.color = 'blue';

      riepilogoLista.innerHTML = '';

      disponibilitàRegistrata.forEach(entry => {
        const li = document.createElement('li');
        li.className = 'turno';
        li.innerHTML = `<span>${entry.cognome} ${entry.nome}: ${entry.turno} – <em>${entry.annotazione}</em></span>`;
        riepilogoLista.appendChild(li);
      });

      // **Rimuove pulsanti duplicati**
      document.getElementById('modificaBtn')?.remove();
      document.getElementById('eliminaTuttoBtn')?.remove();

      // **Pulsante unico "Modifica Disponibilità"**
      const modificaBtn = document.createElement('button');
      modificaBtn.textContent = 'Modifica Disponibilità';
      modificaBtn.className = 'modifica-btn';
      modificaBtn.id = 'modificaBtn';
      modificaBtn.onclick = () => riapriForm();
      riepilogo.appendChild(modificaBtn);

      // **Pulsante "Elimina Tutto"**
      const eliminaBtn = document.createElement('button');
      eliminaBtn.textContent = 'Elimina Tutto';
      eliminaBtn.className = 'elimina-btn';
      eliminaBtn.id = 'eliminaTuttoBtn';
      eliminaBtn.onclick = () => confermaEliminazione();
      riepilogo.appendChild(eliminaBtn);

      // **Nasconde altri pulsanti**
      container.style.display = 'none';
      submitBtn.style.display = 'none';
    } else {
      verificaMsg.textContent = '✅ Cardiologo verificato!';
      verificaMsg.style.color = 'green';
      creaFasceDynamic();
      container.style.display = 'block';
      submitBtn.style.display = 'inline-block';
    }
  } catch (err) {
    console.error('Errore:', err);
    verificaMsg.textContent = '❌ Errore nella verifica';
    verificaMsg.style.color = 'red';
  } finally {
    loader.style.display = 'none';
  }
}

/* 🔹 Funzione per riaprire il form */
function riapriForm() {
  document.getElementById('riepilogo').style.display = 'none';
  document.getElementById('giorniContainer').style.display = 'block';
  document.getElementById('submitBtn').style.display = 'inline-block';
}

/* 🔹 Funzione per eliminare disponibilità */
async function eliminaDisponibilità(nome, cognome) {
  const response = await fetch('https://script.google.com/macros/s/AKfycbxGBHEBZ_HPWAKqXW8k9ZLUcrjaENu9m9ESUAx8f-zcaD-upohL9F-P-969B6a02kXEbw/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, cognome })
  });

  return response.json();
}

/* 🔹 Popup di conferma prima di eliminare */
async function confermaEliminazione() {
  const nome = document.getElementById('nome').value.trim();
  const cognome = document.getElementById('cognome').value.trim();

  if (confirm("⚠️ Sei sicuro di voler eliminare tutte le disponibilità?")) {
    const result = await eliminaDisponibilità(nome, cognome);
    alert(result.message);
    location.reload();
  }
}
