import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/PatientDetails.css";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State für Daten
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [medicalNotes, setMedicalNotes] = useState([]);
  const [psychologicalRecords, setPsychologicalRecords] = useState([]);
  const [medicalInformation, setMedicalInformation] = useState({});
  const [contactDetails, setContactDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedContactDetails, setEditedContactDetails] = useState({});

  // Funktion zur Kommunikation mit der NUI
  const sendNuiMessage = async (event, data = {}) => {
    try {
      const response = await fetch(`https://${GetParentResourceName()}/${event}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`NUI Fetch Error: Server antwortete mit Status ${response.status}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (err) {
      console.error("NUI Fetch Error:", err);
      return null;
    }
  };

  // Daten beim Mount der Komponente abrufen
  useEffect(() => {
    const fetchData = async () => {
      setMedicalInformation(await sendNuiMessage("getMedicalInformation", { citizenid: id }) || {});
      setMedicalRecords(await sendNuiMessage("getMedicalRecords", { citizenid: id }) || []);
      setMedicalNotes(await sendNuiMessage("getMedicalNotes", { citizenid: id }) || []);
      setPsychologicalRecords(await sendNuiMessage("getPsychologicalRecords", { citizenid: id }) || []);
      setContactDetails(await sendNuiMessage("getContactDetails", { citizenid: id }) || {});
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // Funktionen zur Handhabung der Interaktionen
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const addedNote = await sendNuiMessage("addMedicalNote", { citizenid: id, note: newNote });
    setMedicalNotes([...medicalNotes, addedNote]);
    setNewNote("");
  };

  const handleDeleteNote = async (noteId) => {
    await sendNuiMessage("deleteMedicalNote", { noteId });
    setMedicalNotes(medicalNotes.filter((note) => note.id !== noteId));
  };

  const handleAddMedicalRecord = async () => {
    const newRecord = { citizenid: id, title: "Neue Diagnose", description: "Details hier", created_by: "Du" };
    const addedRecord = await sendNuiMessage("createMedicalRecord", newRecord);
    setMedicalRecords([...medicalRecords, addedRecord]);
  };

  const handleDeleteMedicalRecord = async (recordId) => {
    await sendNuiMessage("deleteMedicalRecord", { recordId });
    setMedicalRecords(medicalRecords.filter((record) => record.id !== recordId));
  };

  const handleAddPsychRecord = async () => {
    const newRecord = { citizenid: id, diagnosis: "Neue Diagnose", treatment: "Behandlung hier", created_by: "Du" };
    const addedRecord = await sendNuiMessage("createPsychologicalRecord", newRecord);
    setPsychologicalRecords([...psychologicalRecords, addedRecord]);
  };

  const handleDeletePsychRecord = async (recordId) => {
    await sendNuiMessage("deletePsychologicalRecord", { recordId });
    setPsychologicalRecords(psychologicalRecords.filter((record) => record.id !== recordId));
  };

  const handleSaveContactDetails = async () => {
    const savedDetails = await sendNuiMessage("saveContactDetails", { citizenid: id, ...editedContactDetails });
    setContactDetails(savedDetails);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="loading">Lade Patientendetails...</div>;
  }

  return (
    <div className="patient-details-container">
      <header>
        <h1>Patientendetails: {medicalInformation.name || "Unbekannt"}</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>🔙 Zurück</button>
      </header>

      <div className="info-grid">
        <div className="card">
          <h2>👤 Persönliche Informationen</h2>
          <p><strong>Name:</strong> {medicalInformation.name}</p>
          <p><strong>Geburtsdatum:</strong> {medicalInformation.dob}</p>
          <p><strong>Geschlecht:</strong> {medicalInformation.gender}</p>
          <p><strong>Größe:</strong> {medicalInformation.height} cm</p>
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

      <section className="medical-info">
        <h2>💊 Medizinische Informationen</h2>
        <p><strong>Medikation:</strong> {medicalInformation.medication}</p>
      </section>

      <div className="tab-container">
        <button className="tab" onClick={handleAddMedicalRecord}>➕ Medizinische Aufzeichnung</button>
        <button className="tab" onClick={handleAddPsychRecord}>➕ Psychologische Aufzeichnung</button>
      </div>

      <section>
        <h2>🩺 Medizinische Aufzeichnungen</h2>
        {medicalRecords.map((record) => (
          <div key={record.id} className="record">
            <p><strong>Datum:</strong> {record.timestamp}</p>
            <p><strong>Diagnose:</strong> {record.diagnosis}</p>
            <p><strong>Behandlung:</strong> {record.treatment}</p>
            <p><strong>Erstellt von:</strong> {record.created_by}</p>
            <button onClick={() => handleEditRecord(record.id)}>🖊️ Bearbeiten</button>
            <button onClick={() => handleDeleteMedicalRecord(record.id)}>❌ Löschen</button>
          </div>
        ))}
      </section>

      <section>
        <h2>🧠 Psychologische Aufzeichnungen</h2>
        {psychologicalRecords.map((record) => (
          <div key={record.id} className="record">
            <p><strong>Datum:</strong> {record.timestamp}</p>
            <p><strong>Diagnose:</strong> {record.diagnosis}</p>
            <p><strong>Behandlung:</strong> {record.treatment}</p>
            <p><strong>Erstellt von:</strong> {record.created_by}</p>
            <button onClick={() => handleEditRecord(record.id)}>🖊️ Bearbeiten</button>
            <button onClick={() => handleDeletePsychRecord(record.id)}>❌ Löschen</button>
          </div>
        ))}
      </section>

      {isModalOpen && (
        <div className="modal">
          <h2>📞 Bearbeite Kontaktdaten</h2>
          <input type="text" placeholder="Telefon" onChange={(e) => setEditedContactDetails({ ...editedContactDetails, phone: e.target.value })} />
          <button onClick={handleSaveContactDetails}>Speichern</button>
        </div>
      )}
    </div>
  );
};


export default PatientDetails;