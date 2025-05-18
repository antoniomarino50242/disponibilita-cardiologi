import { creaFasceDynamic } from './utils.js'; // funzione che crea le checkbox + textarea

export async function verificaNome() {
  const nomeInput = document.getElementById('nome').value.trim();
  const container = document.getElementById('giorniContainer');
  const verificaMsg = document.getElementById('verifica-msg');
  const submitBtn = document.getElementById('submitBtn');

  if (!nomeInput) return;

  verificaMsg.textContent = 'Verifica in corso...';
  verificaMsg.style.color = '#666';

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwi9b8hgDuwdp-Vkr0xgkwjw7KG-8K2Wko1ibo4dQEHiEgRYMJum9_2o3WdefffjXEpzg/exec');
    const lista = await response.json();

    const normalizza = str =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ').trim();

    const paroleInput = normalizza(nomeInput).split(' ').sort();

    const trovato = lista.some(nomeLista => {
      const paroleLista = normalizza(nomeLista).split(' ').sort();
      return JSON.stringify(paroleInput) === JSON.stringify(paroleLista);
    });

    if (trovato) {
      verificaMsg.textContent = 'Nome verificato ✅';
      verificaMsg.style.color = 'green';
      creaFasceDynamic(); // genera le fasce
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
  }
}
