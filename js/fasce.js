export function creaFasce(event) {
  event.preventDefault();

  const container = document.getElementById('giorniContainer');
  const riepilogoLista = document.getElementById('riepilogoLista');
  const riepilogo = document.getElementById('riepilogo');
  const nome = document.getElementById('nome').value.trim();
  const selezioni = document.querySelectorAll('input[type=checkbox]:checked');
  const disponibilita = new Set();

  selezioni.forEach(c => {
    const chiave = `${nome.toLowerCase()}|${c.value}`;
    if (disponibilita.has(chiave)) return;

    disponibilita.add(chiave);

    const notaTextarea = c.parentElement.querySelector('textarea');
    const nota = notaTextarea?.value.trim() || '';

    const li = document.createElement('li');
    li.className = 'turno';

    const cognome = document.getElementById('cognome').value.trim();
    let testo = `${cognome} ${nome}: ${c.value}`;

    if (nota) testo += ` – <em>${nota}</em>`;

    li.innerHTML = `<span>${testo}</span>`;

    const btn = document.createElement('button');
    btn.textContent = 'Rimuovi';
    btn.className = 'rimuovi';
    btn.onclick = () => {
      disponibilita.delete(chiave);
      li.remove();
      if (!riepilogoLista.hasChildNodes()) {
        riepilogo.style.display = 'none';
        inviaBtn.style.display = 'none';
        eliminaBtn.style.display = 'none';
        nomeSection.style.display = 'block';
      }
    };

    li.appendChild(btn);
    riepilogoLista.appendChild(li);
  });

  if (riepilogoLista.hasChildNodes()) {
    riepilogo.style.display = 'block';
    document.getElementById('inviaBtn').style.display = 'inline-block';
    document.getElementById('eliminaBtn').style.display = 'inline-block';
    document.getElementById('nomeSection').style.display = 'none';
  
    // 👇 Nasconde la sezione Disponibile/Ferie
    const disponibilitaSettimana = document.getElementById('disponibilitaSettimana');
    if (disponibilitaSettimana) disponibilitaSettimana.style.display = 'none';
  }


  document.getElementById('moduloDisponibilita').reset();
  document.querySelectorAll('.annotazione').forEach(div => div.style.display = 'none');
  container.style.display = 'none';
  document.getElementById('submitBtn').style.display = 'none';
  document.getElementById('verifica-msg').textContent = '';
}

// fasce.js

// Funzione helper: crea checkbox per turno mattina/pomeriggio (lun-sab)
function creaTurniMattinaPomeriggio(container, prefix) {
  const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  giorni.forEach(giorno => {
    const divGiorno = document.createElement('div');
    divGiorno.className = 'giorno';

    const titolo = document.createElement('strong');
    titolo.textContent = giorno;
    divGiorno.appendChild(titolo);

    ['Mattina', 'Pomeriggio'].forEach(fascia => {
      const idCheckbox = `${prefix}_${giorno}_${fascia}`.replace(/\s+/g, '');
      const label = document.createElement('label');
      label.style.marginLeft = '10px';
      label.style.fontWeight = 'normal';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = idCheckbox;
      checkbox.value = `${giorno} ${fascia}`;
      checkbox.name = 'fascia';

      // Mostra/nascondi textarea annotazioni alla selezione checkbox
      checkbox.addEventListener('change', () => {
        const annotazione = label.querySelector('textarea');
        if (checkbox.checked) {
          annotazione.style.display = 'block';
        } else {
          annotazione.style.display = 'none';
          annotazione.value = '';
        }
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${fascia}`));

      // textarea annotazione nascosta di default
      const textarea = document.createElement('textarea');
      textarea.className = 'annotazione';
      textarea.placeholder = 'Annotazioni...';
      textarea.style.display = 'none';
      textarea.style.marginLeft = '10px';
      textarea.rows = 2;
      textarea.cols = 40;
      label.appendChild(textarea);

      divGiorno.appendChild(label);
    });

    container.appendChild(divGiorno);
  });
}

// Funzione helper: crea checkbox per turno giornaliero (lun-dom)
function creaTurniGiornalieri(container, prefix, giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']) {
  giorni.forEach(giorno => {
    const divGiorno = document.createElement('div');
    divGiorno.className = 'giorno';

    const label = document.createElement('label');
    label.style.fontWeight = 'normal';

    const idCheckbox = `${prefix}_${giorno}`.replace(/\s+/g, '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = idCheckbox;
    checkbox.value = `${giorno}`;
    checkbox.name = 'fascia';

    checkbox.addEventListener('change', () => {
      const annotazione = label.querySelector('textarea');
      if (checkbox.checked) {
        annotazione.style.display = 'block';
      } else {
        annotazione.style.display = 'none';
        annotazione.value = '';
      }
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${giorno}`));

    // textarea annotazione nascosta di default
    const textarea = document.createElement('textarea');
    textarea.className = 'annotazione';
    textarea.placeholder = 'Annotazioni...';
    textarea.style.display = 'none';
    textarea.style.marginLeft = '10px';
    textarea.rows = 2;
    textarea.cols = 40;
    label.appendChild(textarea);

    divGiorno.appendChild(label);
    container.appendChild(divGiorno);
  });
}

// Funzione helper: crea checkbox per consuntivo con campo numero max esami (lun-sab)
function creaTurniConsuntivo(container, prefix, labelTesto) {
  const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

  giorni.forEach(giorno => {
    const divGiorno = document.createElement('div');
    divGiorno.className = 'giorno';

    // Label checkbox e numero max in un div
    const label = document.createElement('label');
    label.style.fontWeight = 'normal';

    const idCheckbox = `${prefix}_${giorno}`.replace(/\s+/g, '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = idCheckbox;
    checkbox.value = `${giorno}`;
    checkbox.name = 'fascia';

    checkbox.addEventListener('change', () => {
      const annotazione = divGiorno.querySelector('textarea.annotazione');
      const numeroMax = divGiorno.querySelector('input.numeroMax');

      if (checkbox.checked) {
        annotazione.style.display = 'block';
        numeroMax.style.display = 'inline-block';
      } else {
        annotazione.style.display = 'none';
        annotazione.value = '';
        numeroMax.style.display = 'none';
        numeroMax.value = '';
      }
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${giorno}`));
    divGiorno.appendChild(label);

    // input numero max esami
    const inputNumMax = document.createElement('input');
    inputNumMax.type = 'number';
    inputNumMax.min = 0;
    inputNumMax.placeholder = 'Max esami';
    inputNumMax.className = 'numeroMax';
    inputNumMax.style.marginLeft = '10px';
    inputNumMax.style.display = 'none';
    divGiorno.appendChild(inputNumMax);

    // textarea annotazione nascosta
    const textarea = document.createElement('textarea');
    textarea.className = 'annotazione';
    textarea.placeholder = 'Annotazioni...';
    textarea.style.display = 'none';
    textarea.style.marginLeft = '10px';
    textarea.rows = 2;
    textarea.cols = 40;
    divGiorno.appendChild(textarea);

    container.appendChild(divGiorno);
  });
}

// Funzione principale che genera i campi dinamici in base alle tipologie
export function creaFasceDynamic(tipologie) {
  const container = document.getElementById('giorniContainer');
  container.innerHTML = ''; // pulisci

  if (!tipologie || tipologie.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';

  tipologie.forEach(tipologiaRaw => {
    const tipologia = tipologiaRaw.toLowerCase();

    // Usa un wrapper per ogni tipologia per chiarezza
    const wrapper = document.createElement('div');
    wrapper.style.border = '1px solid #ccc';
    wrapper.style.padding = '10px';
    wrapper.style.marginBottom = '15px';
    wrapper.style.borderRadius = '8px';

    // Titolo sopra ogni gruppo
    const titolo = document.createElement('h3');
    titolo.textContent = `Turno: ${tipologiaRaw}`;
    wrapper.appendChild(titolo);

    // Ora crea i campi in base alla tipologia

    if (['completo', 'solo ecg', 'ecg 100', 'ecg 75'].includes(tipologia)) {
      const descrizione = document.createElement('p');
      descrizione.textContent = "Inserire le disponibilità per mattina e pomeriggio da Lunedì a Sabato";
      wrapper.appendChild(descrizione);
      creaTurniMattinaPomeriggio(wrapper, tipologia);
    } else if (['turno hc', 'turno holter'].includes(tipologia)) {
      const descrizione = document.createElement('p');
      descrizione.textContent = "Inserire le disponibilità giornaliere da Lunedì a Domenica";
      wrapper.appendChild(descrizione);
      creaTurniGiornalieri(wrapper, tipologia);
    } else if (['hc consuntivo', 'hp consuntivo'].includes(tipologia)) {
      const descrizione = document.createElement('p');
      descrizione.textContent = "Indicare disponibilità, numero massimo esami e annotazioni da Lunedì a Sabato";
      wrapper.appendChild(descrizione);
      creaTurniConsuntivo(wrapper, tipologia);
    } else if (['spirometria consuntivo', 'polisonnografia consuntivo'].includes(tipologia)) {
      const descrizione = document.createElement('p');
      descrizione.textContent = "Inserire disponibilità giornaliera da Lunedì a Sabato con annotazioni";
      wrapper.appendChild(descrizione);
      creaTurniGiornalieri(wrapper, tipologia, ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']);
    } else {
      // fallback: niente
      console.warn(`Tipologia non gestita in creaFasceDynamic: ${tipologiaRaw}`);
    }

    container.appendChild(wrapper);
  });
}

