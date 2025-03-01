import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import "./css/PatientDetails.css";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State-Management für verschiedene Bereiche
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [medicalNotes, setMedicalNotes] = useState([]);
  const [psychologicalRecords, setPsychologicalRecords] = useState([]);
  const [medicalInformation, setMedicalInformation] = useState({});
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");

  // Daten abrufen
  useEffect(() => {
    const fetchData = async () => {
      const medInfo = await fetchMedicalInformation(id);
      const medRecords = await fetchMedicalRecords(id);
      const medNotes = await fetchMedicalNotes(id);
      const psychRecords = await fetchPsychologicalRecords(id);

      setMedicalInformation(medInfo || {});
      setMedicalRecords(medRecords || []);
      setMedicalNotes(medNotes || []);
      setPsychologicalRecords(psychRecords || []);
      setLoading(false);
    };

    fetchData();

    // Event-Listener für Echtzeit-Updates
    const handleMessage = (event) => {
      if (!event.data || typeof event.data !== "object") return;

      switch (event.data.type) {
        case "sendMedicalRecords":
          setMedicalRecords(Array.isArray(event.data.records) ? event.data.records : []);
          break;
        case "sendMedicalNotes":
          setMedicalNotes(Array.isArray(event.data.notes) ? event.data.notes : []);
          break;
        case "sendMedicalInformation":
          setMedicalInformation(event.data.information || {});
          break;
        case "sendPsychologicalRecords":
          setPsychologicalRecords(Array.isArray(event.data.records) ? event.data.records : []);
          break;
        default:
          console.warn("⚠️ Unbekannter Event:", event.data.type);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [id]);

  // Notiz hinzufügen
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    await addMedicalNote({ citizenid: id, note: newNote });
    setNewNote("");
  };

  if (loading) {
    return <div className="loading">Lade Patientendetails...</div>;
  }

  return (
    <div className="patient-details-container">
      <header>
        <h1>📋 Patientendetails</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>🔙 Zurück</button>
      </header>

      {/* Persönliche Informationen */}
      <div className="info-grid">
        <div className="card">
          <h2>👤 Personeninformationen</h2>
          <p><strong>Vorname:</strong> {medicalInformation.firstname || "Unbekannt"}</p>
          <p><strong>Nachname:</strong> {medicalInformation.lastname || "Unbekannt"}</p>
          <p><strong>Geschlecht:</strong> {medicalInformation.gender || "Unbekannt"}</p>
          <p><strong>Größe:</strong> {medicalInformation.height || "Unbekannt"} cm</p>
        </div>

        <div className="card">
          <h2>📞 Kontaktdaten</h2>
          <p><strong>Telefon:</strong> {medicalInformation.phone || "Nicht angegeben"}</p>
          <p><strong>Email:</strong> {medicalInformation.email || "Nicht angegeben"}</p>
          <p><strong>Blutgruppe:</strong> {medicalInformation.bloodType || "Unbekannt"}</p>
        </div>
      </div>

      {/* Medizinische Notizen */}
      <section className="notes">
        <h2>📝 Medizinische Notizen</h2>
        {medicalNotes.length > 0 ? (
          medicalNotes.map((note, index) => (
            <div key={index} className="note">
              <p><strong>📅 Datum:</strong> {note.date}</p>
              <p><strong>📌 Notiz:</strong> {note.note}</p>
              <p><strong>👨‍⚕️ Erstellt von:</strong> {note.created_by || "Unbekannt"}</p>
            </div>
          ))
        ) : (
          <p>Keine medizinischen Notizen vorhanden.</p>
        )}

        <textarea
          placeholder="Neue Notiz hinzufügen..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button onClick={handleAddNote}>➕ Notiz hinzufügen</button>
      </section>

      {/* Medizinische Infos */}
      <section className="medical-info">
        <h2>🩺 Medizinische Informationen</h2>
        <p><strong>Medikation:</strong> {medicalInformation.medication || "Keine"}</p>
        <p><strong>Dosierung:</strong> {medicalInformation.dosage || "Keine"}</p>
        <p><strong>Behandlung:</strong> {medicalInformation.treatment || "Keine"}</p>
        <p><strong>Notizen:</strong> {medicalInformation.notes || "Keine"}</p>
      </section>

      {/* Tabs für Medical Records und Psychological Records */}
      <div className="tab-container">
        <button className="tab">📁 Medizinische Aufzeichnungen</button>
        <button className="tab">🧠 Psychologische Aufzeichnungen</button>
      </div>
    </div>
  );
};

export default PatientDetails;
