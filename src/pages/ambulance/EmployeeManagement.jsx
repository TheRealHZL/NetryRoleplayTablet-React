import React, { useState } from "react";
import "./css/EmployeeManagement.css";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Max Mustermann",
      rank: "Rettungssanitäter",
      status: "Im Dienst",
      experience: "3 Jahre",
      birthDate: "15.03.1992",
      employmentDate: "01.06.2022",
      phoneNumber: "0171-5555555",
      address: "Musterstraße 12, 12345 Stadt",
      shifts: [{ date: "12.03.2025", duration: "8h", incidents: "Verkehrsunfall" }],
      qualifications: ["Erste Hilfe", "Notarzt-Assistenz"],
      specializations: ["Traumanotfall", "Reanimation"],
      documents: ["Erste-Hilfe-Zertifikat.pdf", "Arbeitsvertrag.pdf"],
      notes: "Sehr engagiert, schnelle Auffassungsgabe.",
      permissions: ["Fahrberechtigung RTW", "Medikamentenfreigabe"],
      evaluations: [{ date: "01.01.2025", evaluator: "Dr. Müller", feedback: "Sehr zuverlässig, schnelle Entscheidungsfähigkeit" }]
    }
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [evaluationData, setEvaluationData] = useState({ date: "", evaluator: "", feedback: "" });

  const addEvaluation = () => {
    if (selectedEmployee) {
      const updatedEmployees = employees.map(emp => {
        if (emp.id === selectedEmployee.id) {
          return {
            ...emp,
            evaluations: [...emp.evaluations, { ...evaluationData }]
          };
        }
        return emp;
      });
      setEmployees(updatedEmployees);
      setEvaluationData({ date: "", evaluator: "", feedback: "" });
      setIsEvaluationModalOpen(false);
    }
  };

  return (
    <div className="employee-management-container">
      <header>
        <h1>Mitarbeiterverwaltung</h1>
        <p>Übersicht aller aktiven & ehemaligen Mitarbeiter</p>
      </header>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Rang</th>
            <th>Status</th>
            <th>Erfahrung</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.rank}</td>
              <td>{emp.status}</td>
              <td>{emp.experience}</td>
              <td>
                <button className="view-button" onClick={() => setSelectedEmployee(emp)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEmployee && (
        <div className="employee-details">
          <h2>{selectedEmployee.name} - {selectedEmployee.rank}</h2>
          <p><strong>Status:</strong> {selectedEmployee.status}</p>
          <p><strong>Erfahrung:</strong> {selectedEmployee.experience}</p>
          <p><strong>Geburtsdatum:</strong> {selectedEmployee.birthDate}</p>
          <p><strong>Eingestellt am:</strong> {selectedEmployee.employmentDate}</p>
          <p><strong>Adresse:</strong> {selectedEmployee.address}</p>
          <p><strong>Telefonnummer:</strong> {selectedEmployee.phoneNumber}</p>
          <h3>🚑 Einsätze</h3>
          <ul>
            {selectedEmployee.shifts.map((shift, index) => (
              <li key={index}>{shift.date} - {shift.duration} - {shift.incidents}</li>
            ))}
          </ul>
          <h3>🎓 Qualifikationen & Spezialisierungen</h3>
          <p><strong>Qualifikationen:</strong> {selectedEmployee.qualifications.join(", ")}</p>
          <p><strong>Spezialisierungen:</strong> {selectedEmployee.specializations.join(", ")}</p>
          <h3>📂 Dokumente</h3>
          <ul>
            {selectedEmployee.documents.map((doc, index) => (
              <li key={index}><a href="#">{doc}</a></li>
            ))}
          </ul>
          <h3>🔑 Berechtigungen</h3>
          <p>{selectedEmployee.permissions.join(", ")}</p>
          <h3>📝 Leistungsbewertungen</h3>
          <ul>
            {selectedEmployee.evaluations.map((evalData, index) => (
              <li key={index}>{evalData.date} - {evalData.evaluator}: {evalData.feedback}</li>
            ))}
          </ul>

          <button onClick={() => setIsEvaluationModalOpen(true)}>+ Bewertung hinzufügen</button>
          <button className="close-button" onClick={() => setSelectedEmployee(null)}>Schließen</button>
        </div>
      )}

      {/* Modal für Leistungsbewertung */}
      {isEvaluationModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Leistungsbewertung hinzufügen</h2>
            <input type="date" placeholder="Datum" value={evaluationData.date} onChange={(e) => setEvaluationData({ ...evaluationData, date: e.target.value })} />
            <input type="text" placeholder="Bewertet von" value={evaluationData.evaluator} onChange={(e) => setEvaluationData({ ...evaluationData, evaluator: e.target.value })} />
            <textarea placeholder="Feedback" value={evaluationData.feedback} onChange={(e) => setEvaluationData({ ...evaluationData, feedback: e.target.value })} />
            <button onClick={addEvaluation}>Speichern</button>
            <button onClick={() => setIsEvaluationModalOpen(false)}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
