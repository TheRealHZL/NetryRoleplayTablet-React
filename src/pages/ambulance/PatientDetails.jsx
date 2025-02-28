import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/PatientDetails.css";
import {
  fetchMedicalRecords,
  createMedicalRecord,
  fetchMedicalNotes,
  addMedicalNote,
  fetchPsychologicalRecords,
  createPsychologicalRecord,
  fetchMedicalInformation,
  saveMedicalInformation
} from "./utils/medical_nui";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State für verschiedene Bereiche
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [medicalNotes, setMedicalNotes] = useState([]);
  const [psychologicalRecords, setPsychologicalRecords] = useState([]);
  const [medicalInformation, setMedicalInformation] = useState({});
  
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState(""); // Für neue Notizen

  // Daten abrufen
  useEffect(() => {
    const fetchData = async () => {
      const medicalInfo = await fetchMedicalInformation(id);
      const records = await fetchMedicalRecords(id);
      const notes = await fetchMedicalNotes(id);
      const psychRecords = await fetchPsychologicalRecords(id);

      setMedicalInformation(medicalInfo);
      setMedicalRecords(records);
      setMedicalNotes(notes);
      setPsychologicalRecords(psychRecords);
      setLoading(false);
    };

    fetchData();

    // Event-Listener für Echtzeit-Updates
    const handleMessage = (event) => {
      if (!event.data || !event.data.type) return;
      
      switch (event.data.type) {
        case 'sendMedicalRecords': setMedicalRecords(event.data.records || []); break;
        case 'sendMedicalNotes': setMedicalNotes(event.data.notes || []); break;
        case 'sendPsychologicalRecords': setPsychologicalRecords(event.data.records || []); break;
        case 'sendMedicalInformation': setMedicalInformation(event.data.information || {}); break;
        default: console.warn("⚠️ Unbekannter Event:", event.data.type);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [id]);

  // Funktion zum Speichern einer neuen Notiz
  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    await addMedicalNote({ citizenid: id, note: newNote });
    setNewNote(""); // Eingabefeld leeren
  };

  if (loading) {
    return <div className="loading">Lade Patientendetails...</div>;
  }

  return (
    <div className="patient-details-container">
      <header>
        <h1>Patientendetails: {medicalInformation.name || 'Unbekannt'}</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>🔙 Zurück</button>
      </header>
      
      <section className="patient-info">
        <h2>📋 Medizinische Informationen</h2>
        <p><strong>🩺 Medikation:</strong> {medicalInformation.medication || 'Keine'}</p>
        <p><strong>💊 Dosierung:</strong> {medicalInformation.dosage || 'Keine'}</p>
        <p><strong>📝 Behandlung:</strong> {medicalInformation.treatment || 'Keine'}</p>
        <p><strong>📌 Notizen:</strong> {medicalInformation.notes || 'Keine'}</p>
      </section>
      
      <section className="records">
        <h2>🩺 Medizinische Aufzeichnungen</h2>
        {medicalRecords.length > 0 ? medicalRecords.map((record, index) => (
          <div key={index} className="record">
            <h3>{record.title}</h3>
            <p><strong>📌 Diagnose:</strong> {record.diagnosis}</p>
            <p><strong>💊 Behandlung:</strong> {record.treatment}</p>
            <p><strong>👨‍⚕️ Erstellt von:</strong> {record.created_by || "Unbekannt"}</p>
          </div>
        )) : <p>Keine medizinischen Aufzeichnungen gefunden.</p>}
      </section>

      <section className="notes">
        <h2>📝 Medizinische Notizen</h2>
        {medicalNotes.length > 0 ? medicalNotes.map((note, index) => (
          <div key={index} className="note">
            <p><strong>📅 Datum:</strong> {note.date}</p>
            <p><strong>📌 Notiz:</strong> {note.note}</p>
            <p><strong>👨‍⚕️ Erstellt von:</strong> {note.created_by || "Unbekannt"}</p>
          </div>
        )) : <p>Keine medizinischen Notizen vorhanden.</p>}

        <div className="add-note">
          <textarea
            placeholder="Neue Notiz hinzufügen..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button onClick={handleAddNote}>➕ Notiz hinzufügen</button>
        </div>
      </section>

      <section className="psychological">
        <h2>🧠 Psychologische Aufzeichnungen</h2>
        {psychologicalRecords.length > 0 ? psychologicalRecords.map((record, index) => (
          <div key={index} className="psychological-record">
            <p><strong>🧠 Diagnose:</strong> {record.diagnosis}</p>
            <p><strong>💬 Behandlung:</strong> {record.treatment}</p>
            <p><strong>⚠️ Risikobewertung:</strong> {record.risk_assessment}</p>
            <p><strong>👨‍⚕️ Erstellt von:</strong> {record.created_by || "Unbekannt"}</p>
          </div>
        )) : <p>Keine psychologischen Aufzeichnungen gefunden.</p>}
      </section>
    </div>
  );
};

export default PatientDetails;
