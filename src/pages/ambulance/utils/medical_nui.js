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
    if (!text) {
      console.warn("⚠️ Leere Antwort von der NUI erhalten.");
      return null;
    }

    const jsonData = JSON.parse(text);
    return jsonData;
  } catch (err) {
    console.error("❌ NUI Fetch Error:", err);
    return null;
  }
}

/**
 * 🔎 Patientensuche
 */
export async function searchPatients(query) {
  const data = await sendMedicalNuiMessage("searchPatients", { query });
  return Array.isArray(data) ? data : [];
}

/**
 * 📋 Medizinische Akten
 */
export async function fetchMedicalRecords(citizenid) {
  const data = await sendMedicalNuiMessage("getMedicalRecords", { citizenid });
  return Array.isArray(data) ? data : [];
}

export async function createMedicalRecord(recordData) {
  return sendMedicalNuiMessage("createMedicalRecord", recordData);
}

/**
 * 📝 Medizinische Notizen
 */
export async function fetchMedicalNotes(citizenid) {
  const data = await sendMedicalNuiMessage("getMedicalNotes", { citizenid });
  return Array.isArray(data) ? data : [];
}

export async function addMedicalNote(noteData) {
  return sendMedicalNuiMessage("addMedicalNote", noteData);
}

/**
 * 🧠 Psychologische Akten
 */
export async function fetchPsychologicalRecords(citizenid) {
  const data = await sendMedicalNuiMessage("getPsychologicalRecords", { citizenid });
  return Array.isArray(data) ? data : [];
}

export async function createPsychologicalRecord(recordData) {
  return sendMedicalNuiMessage("createPsychologicalRecord", recordData);
}

/**
 * 💊 Allgemeine medizinische Informationen
 */
export async function fetchMedicalInformation(citizenid) {
  const data = await sendMedicalNuiMessage("getMedicalInformation", { citizenid });
  return data && typeof data === "object" ? data : {};
}

export async function saveMedicalInformation(infoData) {
  return sendMedicalNuiMessage("saveMedicalInformation", infoData);
}
