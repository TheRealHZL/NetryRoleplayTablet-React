// utils/medical_nui.js

/**
 * 📤 Funktion zur Kommunikation mit der NUI (Netry Tablet)
 */
export async function sendMedicalNuiMessage(event, data = {}) {
  try {
    const response = await fetch(`https://${GetParentResourceName()}/${event}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`❌ NUI Fetch Error: Server antwortete mit Status ${response.status}`);
    }

    const text = await response.text();
    if (!text.trim()) { // Falls die Antwort leer ist
      console.warn("⚠️ Leere Antwort von der NUI erhalten.");
      return [];
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("❌ NUI Fetch Error:", err);
    return [];
  }
}

/**
 * 📌 Event-Listener für NUI-Nachrichten aus der LUA-Seite
 */
window.addEventListener("message", (event) => {
  if (!event.data || !event.data.type) return; // Sicherheitscheck

  console.log("📥 NUI Event empfangen:", event.data); // Debugging

  const { type, data } = event.data;

  switch (type) {
    case "searchResultsEMS": 
    case "searchResultsPolice":
    case "searchResultsFIB":
      window.dispatchEvent(new CustomEvent("patientSearchResultsReceived", { detail: data?.results || [] }));
      break;
    case "medicalRecords":
      window.dispatchEvent(new CustomEvent("medicalRecordsReceived", { detail: data?.records || [] }));
      break;
    case "medicalNotes":
      window.dispatchEvent(new CustomEvent("medicalNotesReceived", { detail: data?.records || [] }));
      break;
    case "medicalInformation":
      window.dispatchEvent(new CustomEvent("medicalInformationReceived", { detail: data?.records || [] }));
      break;
    case "psychologicalRecords":
      window.dispatchEvent(new CustomEvent("psychologicalRecordsReceived", { detail: data?.records || [] }));
      break;
    default:
      console.warn("⚠️ Unbekannter NUI-Typ empfangen:", type);
  }
});

/**
 * 🔎 Patientensuche
 */
export const searchPatients = (query) => sendMedicalNuiMessage("searchPerson", { query });

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
