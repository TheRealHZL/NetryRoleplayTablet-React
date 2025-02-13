import React, { useState } from "react";
import "./css/TrainingDashboard.css";

const TrainingDashboard = () => {
  const [trainees, setTrainees] = useState([
    {
      id: 1,
      name: "Leon Becker",
      status: "In Ausbildung",
      startDate: "01.02.2025",
      mentor: "Dr. Müller",
      progress: 40,
      notes: "Zeigt gute Fortschritte, benötigt mehr Praxis in Notfallmedizin.",
      documents: ["Reanimationstest.pdf"],
      modules: [
        { id: 1, name: "Grundlagen Erste Hilfe", completed: true, grade: "Bestanden", feedback: "Sicherer Umgang mit Basics." },
        { id: 2, name: "Reanimationstraining", completed: false, grade: "", feedback: "" },
        { id: 3, name: "Einsatzbegleitung", completed: false, grade: "", feedback: "" },
      ],
      shifts: [
        { date: "05.03.2025", duration: "6h", incidents: "Notfalltransport" },
        { date: "12.03.2025", duration: "8h", incidents: "Reanimationseinsatz" },
      ],
    }
  ]);

  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleData, setModuleData] = useState({ name: "", completed: false, grade: "", feedback: "" });

  // Modul zum Trainee hinzufügen
  const addModuleToTrainee = () => {
    if (selectedTrainee) {
      const updatedTrainees = trainees.map((trainee) => {
        if (trainee.id === selectedTrainee.id) {
          return {
            ...trainee,
            modules: [...trainee.modules, { id: Date.now(), ...moduleData }]
          };
        }
        return trainee;
      });
      setTrainees(updatedTrainees);
      setModuleData({ name: "", completed: false, grade: "", feedback: "" });
      setIsModuleModalOpen(false);
    }
  };

  // Trainee bearbeiten
  const updateTrainee = (field, value) => {
    setSelectedTrainee({ ...selectedTrainee, [field]: value });
  };

  // Speichern nach Bearbeitung
  const saveTraineeChanges = () => {
    setTrainees(trainees.map((trainee) => (trainee.id === selectedTrainee.id ? selectedTrainee : trainee)));
    setIsEditModalOpen(false);
  };

  return (
    <div className="training-dashboard-container">
      <header>
        <h1>Ausbildungs-Management</h1>
        <p>Verwalte Trainees, Ausbildungspläne und Prüfungen.</p>
      </header>

      {/* Liste der Trainees */}
      <table className="trainee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Startdatum</th>
            <th>Mentor</th>
            <th>Fortschritt</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {trainees.map((trainee) => (
            <tr key={trainee.id}>
              <td>{trainee.name}</td>
              <td>{trainee.status}</td>
              <td>{trainee.startDate}</td>
              <td>{trainee.mentor}</td>
              <td>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${trainee.progress}%` }}>{trainee.progress}%</div>
                </div>
              </td>
              <td>
                <button className="view-button" onClick={() => setSelectedTrainee(trainee)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Detailansicht eines Trainees */}
      {selectedTrainee && (
        <div className="trainee-details">
          <h2>Details zu {selectedTrainee.name}</h2>
          <p><strong>Status:</strong> {selectedTrainee.status}</p>
          <p><strong>Startdatum:</strong> {selectedTrainee.startDate}</p>
          <p><strong>Mentor:</strong> {selectedTrainee.mentor}</p>
          <p><strong>Notizen:</strong> {selectedTrainee.notes || "Keine Notizen"}</p>

          <button onClick={() => setIsEditModalOpen(true)}>Bearbeiten</button>
          <button onClick={() => setIsModuleModalOpen(true)}>+ Modul hinzufügen</button>

          <h3>📜 Ausbildungsplan</h3>
          <ul>
            {selectedTrainee.modules.map((mod) => (
              <li key={mod.id}>
                {mod.name} - {mod.completed ? "✅ Abgeschlossen" : "❌ Offen"} - Bewertung: {mod.grade || "Noch keine"}
              </li>
            ))}
          </ul>

          <button className="close-button" onClick={() => setSelectedTrainee(null)}>Schließen</button>
        </div>
      )}

      {/* Modal für Bearbeitung */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedTrainee.name} bearbeiten</h2>
            <label>Status</label>
            <select value={selectedTrainee.status} onChange={(e) => updateTrainee("status", e.target.value)}>
              <option>In Ausbildung</option>
              <option>Abgeschlossen</option>
            </select>
            <label>Mentor</label>
            <input type="text" value={selectedTrainee.mentor} onChange={(e) => updateTrainee("mentor", e.target.value)} />
            <label>Notizen</label>
            <textarea value={selectedTrainee.notes} onChange={(e) => updateTrainee("notes", e.target.value)} />
            <button onClick={saveTraineeChanges}>Speichern</button>
            <button onClick={() => setIsEditModalOpen(false)}>Abbrechen</button>
          </div>
        </div>
      )}

      {/* Modal für Modul hinzufügen */}
      {isModuleModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Neues Modul hinzufügen</h2>
            <input type="text" placeholder="Modulname" value={moduleData.name} onChange={(e) => setModuleData({ ...moduleData, name: e.target.value })} />
            <label>Abgeschlossen?</label>
            <input type="checkbox" checked={moduleData.completed} onChange={(e) => setModuleData({ ...moduleData, completed: e.target.checked })} />
            <label>Bewertung</label>
            <input type="text" placeholder="Bewertung" value={moduleData.grade} onChange={(e) => setModuleData({ ...moduleData, grade: e.target.value })} />
            <label>Feedback</label>
            <textarea placeholder="Feedback" value={moduleData.feedback} onChange={(e) => setModuleData({ ...moduleData, feedback: e.target.value })} />
            <button onClick={addModuleToTrainee}>Speichern</button>
            <button onClick={() => setIsModuleModalOpen(false)}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingDashboard;
