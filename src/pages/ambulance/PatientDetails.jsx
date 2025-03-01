import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/PatientDetails.css";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ State für alle Daten
  const [patientInfo, setPatientInfo] = useState({});
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [medicalNotes, setMedicalNotes] = useState([]);
  const [psychologicalRecords, setPsychologicalRecords] = useState([]);
  const [medicalInformation, setMedicalInformation] = useState({});
  const [contactDetails, setContactDetails] = useState({});
  const [loading, setLoading] = useState(true);
  
  // ✅ Modals & Eingaben
  const [newNote, setNewNote] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedContactDetails, setEditedContactDetails] = useState({});
  const [activeTab, setActiveTab] = useState("medical");

  // ✅ Funktion für API-Anfragen (NUI-Kommunikation)
  const sendNuiMessage = async (event, data = {}) => {
    try {
      const response = await fetch(`https://${GetParentResourceName()}/${event}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Server antwortete mit Status ${response.status}`);

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (err) {
      console.error("❌ NUI Fetch Error:", err);
      return null;
    }
  };

  // ✅ Alle Daten abrufen
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patient = await sendNuiMessage("getPatientInfo", { citizenid: id });
        const medicalInfo = await sendNuiMessage("getMedicalInformation", { citizenid: id });
        const records = await sendNuiMessage("getMedicalRecords", { citizenid: id });
        const notes = await sendNuiMessage("getMedicalNotes", { citizenid: id });
        const psychRecords = await sendNuiMessage("getPsychologicalRecords", { citizenid: id });
        const contact = await sendNuiMessage("getContactDetails", { citizenid: id });

        setPatientInfo(patient ?? {});
        setMedicalInformation(medicalInfo ?? {});
        setMedicalRecords(records ?? []);
        setMedicalNotes(notes ?? []);
        setPsychologicalRecords(psychRecords ?? []);
        setContactDetails(contact ?? {});
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Laden der Patientendaten:", error);
      }
    };
    fetchData();
  }, [id]);

  // ✅ 📝 Neue Notiz hinzufügen
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const newNoteData = { citizenid: id, note: newNote, created_by: "Du" };
    await sendNuiMessage("addMedicalNote", newNoteData);
    setMedicalNotes([...medicalNotes, newNoteData]);
    setNewNote("");
  };

  // ✅ ❌ Notiz löschen
  const handleDeleteNote = async (noteId) => {
    await sendNuiMessage("deleteMedicalNote", { noteId });
    setMedicalNotes(medicalNotes.filter((note) => note.id !== noteId));
  };

  // ✅ 📋 Neue medizinische Aufzeichnung
  const handleAddMedicalRecord = async () => {
    const newRecord = { citizenid: id, title: "Neue Diagnose", description: "Details hier", created_by: "Du" };
    await sendNuiMessage("createMedicalRecord", newRecord);
    setMedicalRecords([...medicalRecords, newRecord]);
  };

  // ✅ ❌ Medizinische Aufzeichnung löschen
  const handleDeleteMedicalRecord = async (recordId) => {
    await sendNuiMessage("deleteMedicalRecord", { recordId });
    setMedicalRecords(medicalRecords.filter((record) => record.id !== recordId));
  };

  // ✅ 🧠 Neue psychologische Aufzeichnung
  const handleAddPsychRecord = async () => {
    const newRecord = { citizenid: id, diagnosis: "Neue Diagnose", treatment: "Behandlung hier", created_by: "Du" };
    await sendNuiMessage("createPsychologicalRecord", newRecord);
    setPsychologicalRecords([...psychologicalRecords, newRecord]);
  };

  // ✅ ❌ Psychologische Aufzeichnung löschen
  const handleDeletePsychRecord = async (recordId) => {
    await sendNuiMessage("deletePsychologicalRecord", { recordId });
    setPsychologicalRecords(psychologicalRecords.filter((record) => record.id !== recordId));
  };

  // ✅ 🖊️ Kontaktinformationen bearbeiten
  const handleSaveContactDetails = async () => {
    await sendNuiMessage("saveContactDetails", { citizenid: id, ...editedContactDetails });
    setContactDetails(editedContactDetails);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="loading">Lade Patientendetails...</div>;
  }

  return (
    <div className="patient-details-container">
      <header>
        <h1>Patientendetails: {patientInfo.firstname} {patientInfo.lastname}</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>🔙 Zurück</button>
      </header>

      <div className="info-grid">
        <div className="card">
          <h2>👤 Persönliche Informationen</h2>
          <p><strong>Name:</strong> {patientInfo.firstname} {patientInfo.lastname}</p>
          <p><strong>Geburtsdatum:</strong> {patientInfo.dob}</p>
          <p><strong>Geschlecht:</strong> {patientInfo.gender}</p>
          <p><strong>Größe:</strong> {patientInfo.height} cm</p>
        </div>
        <div className="card">
          <h2>📞 Kontaktdaten <span onClick={() => setIsModalOpen(true)}>🖊️</span></h2>
          <p><strong>Telefon:</strong> {contactDetails.phone || "Nicht angegeben"}</p>
          <p><strong>Discord:</strong> {contactDetails.discord || "Nicht angegeben"}</p>
          <p><strong>Email:</strong> {contactDetails.email || "Nicht angegeben"}</p>
        </div>
      </div>

      <section className="notes">
        <h2>📝 Medizinische Notizen</h2>
        {medicalNotes.map((note) => (
          <div key={note.id} className="note">
            <p>{note.note}</p>
            <p><strong>Erstellt von:</strong> {note.created_by}</p>
            <button onClick={() => handleDeleteNote(note.id)}>❌ Löschen</button>
          </div>
        ))}
        <textarea placeholder="Neue Notiz..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
        <button onClick={handleAddNote}>➕ Notiz hinzufügen</button>
      </section>
    </div>
  );
};

export default PatientDetails;
