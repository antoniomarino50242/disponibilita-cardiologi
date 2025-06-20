export const mappaTipologie = {
  completo: {
    testo: "Inserire le disponibilità per il turno COMPLETO (ECG, HC e HP)",
    checkbox: ["ECG", "HC", "HP"]
  },
  soloecg: {
    testo: "Inserire le disponibilità per il turno SOLO ECG",
    checkbox: ["ECG"]
  },
  ecg100: {
    testo: "Inserire le disponibilità per il turno ECG, max 100",
    checkbox: ["ECG 100"]
  },
  ecg75: {
    testo: "Inserire le disponibilità per il turno ECG, max 75",
    checkbox: ["ECG 75"]
  },
  turnohc: {
    testo: "Inserire le disponibilità per il turno HC",
    checkbox: ["HC"]
  },
  turnoholter: {
    testo: "Inserire le disponibilità per il turno SOLO HOLTERS",
    checkbox: ["HOLTER"]
  },
  hcconsuntivo: {
    testo: "Indicare le disponibilità e specificare il limite massimo giornaliero per HC a consuntivo.",
    checkbox: ["HC CONSUNTIVO"]
  },
  hpconsuntivo: {
    testo: "Indicare le disponibilità e specificare il limite massimo giornaliero per HP a consuntivo.",
    checkbox: ["HP CONSUNTIVO"]
  },
  spirometriaconsuntivo: {
    testo: "Inserire le disponibilità per il turno SPIROMETRIA a consuntivo",
    checkbox: ["SPIROMETRIA CONSUNTIVO"]
  },
  polisonnografiaconsuntivo: {
    testo: "Inserire le disponibilità per il turno POLISONNOGRAFIA a consuntivo",
    checkbox: ["POLISONNOGRAFIA CONSUNTIVO"]
  }
};
