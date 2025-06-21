export const mappaTipologie = {
  completo: {
    testo: "Inserire le disponibilità per il turno COMPLETO (ECG, HC e HP)",
    checkbox: ["ECG", "HC", "HP"]
  },
  "solo ecg": {
    testo: "Inserire le disponibilità per il turno SOLO ECG",
    checkbox: ["ECG"]
  },
  "ecg 100": {
    testo: "Inserire le disponibilità per il turno ECG, max 100",
    checkbox: ["ECG 100"]
  },
  "ecg 75": {
    testo: "Inserire le disponibilità per il turno ECG, max 75",
    checkbox: ["ECG 75"]
  },
  "turno holter": {
    testo: "Inserire le disponibilità per il turno solo HOLTER",
    checkbox: ["TURNO HOLTER"]
  },
  "hc consuntivo": {
    testo: "Indicare le disponibilità e specificare il limite massimo giornaliero per HC a consuntivo.",
    checkbox: ["HC CONSUNTIVO"]
  },
  "hp consuntivo": {
    testo: "Indicare le disponibilità e specificare il limite massimo giornaliero per HP a consuntivo.",
    checkbox: ["HP CONSUNTIVO"]
  },
  "spirometria consuntivo": {
    testo: "Inserire le disponibilità per il turno SPIROMETRIA a consuntivo",
    checkbox: ["SPIROMETRIA CONSUNTIVO"]
  },
  "polisonnografia consuntivo": {
    testo: "Inserire le disponibilità per il turno POLISONNOGRAFIA a consuntivo",
    checkbox: ["POLISONNOGRAFIA CONSUNTIVO"]
  }
};
