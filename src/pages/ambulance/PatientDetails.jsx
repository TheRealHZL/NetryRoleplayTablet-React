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
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [medicalNotes, setMedicalNotes] = useState([]);
  const [psychologicalRecords, setPsychologicalRecords] = useState([]);
  const [medicalInformation, setMedicalInformation] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchMedicalRecords(id);
      await fetchMedicalNotes(id);
      await fetchPsychologicalRecords(id);
      await fetchMedicalInformation(id);
      setLoading(false);
    };

    fetchData();

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        // Sicherstellen, dass Nachrichten nur von der vertrauenswürdigen Quelle kommen
        return;
      }
      switch (event.data.event) {
        case 'sendMedicalRecords':
          setMedicalRecords(event.data.records);
          break;
        case 'sendMedicalNotes':
          setMedicalNotes(event.data.notes);
          break;
        case 'sendPsychologicalRecords':
          setPsychologicalRecords(event.data.records);
          break;
        case 'sendMedicalInformation':
          setMedicalInformation(event.data.information);
          break;
        default:
          // Keine Aktion
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [id]);

  if (loading) {
    return <div className="loading">Lade Patientendetails...</div>;
  }

  return (
    <div className="patient-details-container">
      <header>
        <h1>Patientendetails: {medicalInformation.name || 'Unbekannt'}</h1>
        <button onClick={() => navigate(-1)}>Zurück</button>
      </header>
      
      <section className="patient-info">
        <h2>Medizinische Informationen</h2>
        <p><strong>Medikation:</strong> {medicalInformation.medication || 'Keine'}</p>
        <p><strong>Dosierung:</strong> {medicalInformation.dosage || 'Keine'}</p>
        <p><strong>Behandlung:</strong> {medicalInformation.treatment || 'Keine'}</p>
        <p><strong>Notizen:</strong> {medicalInformation.notes || 'Keine'}</p>
      </section>
      
      <section className="records">
        <h2>Medizinische Aufzeichnungen</h2>
        {medicalRecords.map((record, index) => (
          <div key={index} className="record">
            <p><strong>Titel:</strong> {record.title}</p>
            <p><strong>Beschreibung:</strong> {record.description}</p>
            <p><strong>Diagnose:</strong> {record.diagnosis}</p>
            <p><strong>Behandlung:</strong> {record.treatment}</p>
            <p><strong>Verschriebene Medikation:</strong> {record.prescribed_medication}</p>
          </div>
        ))}
      </section>

      <section className="notes">
        <h2>Medizinische Notizen</h2>
        {medicalNotes.map((note, index) => (
          <div key={index} className="note">
            <p><strong>Datum:</strong> {note.date}</p>
            <p><strong>Notiz:</strong> {note.note}</p>
          </div>
        ))}
      </section>

      <section className="psychological">
        <h2>Psychologische Aufzeichnungen</h2>
        {psychologicalRecords.map((record, index) => (
          <div key={index} className="psychological-record">
            <p><strong>Diagnose:</strong> {record.diagnosis}</p>
            <p><strong>Behandlung:</strong> {record.treatment}</p>
            <p><strong>Risikobewertung:</strong> {record.risk_assessment}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default PatientDetails;
