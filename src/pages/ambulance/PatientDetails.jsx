import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/PatientDetails.css";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    // Simuliere das Abrufen von Patientendaten (API-Aufruf)
    const mockPatient = {
      id,
      name: "Max Mustermann",
      dob: "01.01.1985",
      bloodType: "A+",
      allergies: "Keine",
      conditions: "Bluthochdruck",
    };
    const mockNotes = [
      { date: "10.02.2025", text: "Patient klagte über Brustschmerzen." },
      { date: "08.02.2025", text: "Routineuntersuchung durchgeführt." },
    ];

    setPatient(mockPatient);
    setNotes(mockNotes);
  }, [id]);

  const addNote = () => {
    const updatedNotes = [
      ...notes,
      { date: new Date().toLocaleDateString(), text: newNote },
    ];
    setNotes(updatedNotes);
    setNewNote("");
  };

  if (!patient) {
    return <div>Lade Patientendetails...</div>;
  }

  return (
    <div className="patient-details-container">
      <header>
        <h1>Details zu {patient.name}</h1>
        <button onClick={() => navigate(-1)}>Zurück</button>
      </header>

      <section className="patient-info">
        <h2>Patienteninformationen</h2>
        <p><strong>Geburtsdatum:</strong> {patient.dob}</p>
        <p><strong>Blutgruppe:</strong> {patient.bloodType}</p>
        <p><strong>Allergien:</strong> {patient.allergies}</p>
        <p><strong>Vorerkrankungen:</strong> {patient.conditions}</p>
      </section>

      <section className="patient-notes">
        <h2>Notizen</h2>
        <ul>
          {notes.map((note, index) => (
            <li key={index}>
              <strong>{note.date}:</strong> {note.text}
            </li>
          ))}
        </ul>
        <textarea
          placeholder="Neue Notiz hinzufügen..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button onClick={addNote}>Notiz speichern</button>
      </section>
    </div>
  );
};

export default PatientDetails;
