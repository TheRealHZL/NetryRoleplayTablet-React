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
    if (!text) {
      console.warn("⚠️ Leere Antwort von der NUI erhalten.");
      return null;
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("❌ NUI Fetch Error:", err);
    return null;
  }
}

/**
 * 🔎 Patientensuche
 */
export async function searchPatients(query) {
  return sendMedicalNuiMessage("searchPatients", { query });
}

/** 📋 **Medizinische Akten (CRUD)** */
export const fetchMedicalRecords = async (citizenid) => sendMedicalNuiMessage("getMedicalRecords", { citizenid }) || [];
export const createMedicalRecord = async (data) => sendMedicalNuiMessage("createMedicalRecord", data);
export const deleteMedicalRecord = async (recordId) => sendMedicalNuiMessage("deleteMedicalRecord", { recordId });

/** 📝 **Medizinische Notizen (CRUD)** */
export const fetchMedicalNotes = async (citizenid) => sendMedicalNuiMessage("getMedicalNotes", { citizenid }) || [];
export const addMedicalNote = async (data) => sendMedicalNuiMessage("addMedicalNote", data);
export const deleteMedicalNote = async (noteId) => sendMedicalNuiMessage("deleteMedicalNote", { noteId });

/** 🧠 **Psychologische Akten (CRUD)** */
export const fetchPsychologicalRecords = async (citizenid) => sendMedicalNuiMessage("getPsychologicalRecords", { citizenid }) || [];
export const createPsychologicalRecord = async (data) => sendMedicalNuiMessage("createPsychologicalRecord", data);
export const deletePsychologicalRecord = async (recordId) => sendMedicalNuiMessage("deletePsychologicalRecord", { recordId });

/** 💊 **Allgemeine medizinische Informationen (CRUD)** */
export const fetchMedicalInformation = async (citizenid) => sendMedicalNuiMessage("getMedicalInformation", { citizenid }) || {};
export const saveMedicalInformation = async (data) => sendMedicalNuiMessage("saveMedicalInformation", data);

/** ☎️ **Kontaktinformationen abrufen & speichern (CRUD)** */
export const fetchContactDetails = async (citizenid) => sendMedicalNuiMessage("getContactDetails", { citizenid }) || {};
export const saveContactDetails = async (data) => sendMedicalNuiMessage("saveContactDetails", data);

/** 🆔 **Patienten-Informationen abrufen** */
export const fetchPatientInfo = async (citizenid) => sendMedicalNuiMessage("getPatientInfo", { citizenid }) || {};