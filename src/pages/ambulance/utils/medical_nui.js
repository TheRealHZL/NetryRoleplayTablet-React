// utils/medical_nui.js

/**
 * 📤 Funktion zur Kommunikation mit der NUI (Netry Tablet)
 */
export async function sendMedicalNuiMessage(event, data = {}) {
  return fetch(`https://${GetParentResourceName()}/${event}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.error("❌ NUI Fetch Error:", err));
}

/**
 * 📌 Event-Listener für NUI-Nachrichten aus der LUA-Seite
 */
window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) return; // Sicherheitscheck

  const { type, data } = event.data;

  switch (type) {
    case "patientSearchResults":
      window.dispatchEvent(new CustomEvent("patientSearchResultsReceived", { detail: data.results }));
      break;
    case "medicalRecords":
      window.dispatchEvent(new CustomEvent("medicalRecordsReceived", { detail: data.records }));
      break;
    case "medicalNotes":
      window.dispatchEvent(new CustomEvent("medicalNotesReceived", { detail: data.records }));
      break;
    case "medicalInformation":
      window.dispatchEvent(new CustomEvent("medicalInformationReceived", { detail: data.records }));
      break;
    case "psychologicalRecords":
      window.dispatchEvent(new CustomEvent("psychologicalRecordsReceived", { detail: data.records }));
      break;
    default:
      console.warn("⚠️ Unbekannter NUI-Typ empfangen:", type);
  }
});

/**
 * 🔎 Patientensuche
 */
export const searchPatients = (query) => sendMedicalNuiMessage("searchPatients", { query });

/**
 * 📋 Medizinische Akten
 */
export const fetchMedicalRecords = (citizenid) => sendMedicalNuiMessage("getMedicalRecords", { citizenid });
export const createMedicalRecord = (data) => sendMedicalNuiMessage("createMedicalRecord", data);

/**
 * 📝 Medizinische Notizen
 */
export const fetchMedicalNotes = (citizenid) => sendMedicalNuiMessage("getMedicalNotes", { citizenid });
export const addMedicalNote = (data) => sendMedicalNuiMessage("addMedicalNote", data);

/**
 * 🧠 Psychologische Akten
 */
export const fetchPsychologicalRecords = (citizenid) => sendMedicalNuiMessage("getPsychologicalRecords", { citizenid });
export const createPsychologicalRecord = (data) => sendMedicalNuiMessage("createPsychologicalRecord", data);

/**
 * 💊 Allgemeine medizinische Informationen
 */
export const fetchMedicalInformation = (citizenid) => sendMedicalNuiMessage("getMedicalInformation", { citizenid });
export const saveMedicalInformation = (data) => sendMedicalNuiMessage("saveMedicalInformation", data);
