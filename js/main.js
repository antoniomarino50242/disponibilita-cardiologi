const disponibileCheckbox = document.getElementById('disponibileCheckbox');
const ferieCheckbox = document.getElementById('ferieCheckbox');
const giorniContainer = document.getElementById('giorniContainer');
const submitBtn = document.getElementById('submitBtn');

// 🔹 Mostra le fasce orarie solo se selezionato "Sono disponibile"
disponibileCheckbox.addEventListener('change', function () {
  if (this.checked) {
    ferieCheckbox.checked = false;
    giorniContainer.style.display = 'block';
    submitBtn.style.display = 'inline-block';
    creaFasceDynamic(); // ⚡ Genera le fasce orarie dinamicamente
  } else {
    giorniContainer.style.display = 'none';
    submitBtn.style.display = 'none';
  }
});

// 🔹 Se selezionato "Sono in ferie", nasconde le fasce orarie
ferieCheckbox.addEventListener('change', function () {
  if (this.checked) {
    disponibileCheckbox.checked = false;
    giorniContainer.style.display = 'none';
    submitBtn.style.display = 'none';
  }
});
