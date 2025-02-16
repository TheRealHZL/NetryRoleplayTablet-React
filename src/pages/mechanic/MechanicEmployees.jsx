import React, { useState, useEffect } from "react";
import "./css/MechanicEmployees.css";

const MechanicEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ name: "", rank: "", experience: "", specializations: "", documents: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mitarbeiter aus der FiveM API abrufen
  useEffect(() => {
    fetchEmployees();
    window.addEventListener("message", (event) => {
      if (event.data.type === "mechanic:setEmployees") {
        setEmployees(event.data.employees);
      }
    });
  }, []);

  const fetchEmployees = () => {
    fetch(`https://mechanic/getEmployees`)
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error("Fehler beim Abrufen der Mitarbeiter:", error));
  };

  // Neuen Mitarbeiter hinzufügen
  const addEmployee = () => {
    fetch(`https://mechanic/addEmployee`, {
      method: "POST",
      body: JSON.stringify(newEmployee),
      headers: { "Content-Type": "application/json" }
    }).then(() => {
      fetchEmployees();
      setIsModalOpen(false);
    });
  };

  // Mitarbeiter bearbeiten
  const updateEmployee = () => {
    fetch(`https://mechanic/updateEmployee`, {
      method: "POST",
      body: JSON.stringify(selectedEmployee),
      headers: { "Content-Type": "application/json" }
    }).then(() => {
      fetchEmployees();
      setIsEditModalOpen(false);
    });
  };

  return (
    <div className="mechanic-employee-container">
      <header>
        <h1>Mechaniker-Mitarbeiter</h1>
        <button className="add-employee-btn" onClick={() => setIsModalOpen(true)}>+ Neuer Mitarbeiter</button>
      </header>

      {/* Mitarbeiterliste */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Rang</th>
            <th>Erfahrung</th>
            <th>Spezialisierungen</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.rank}</td>
              <td>{emp.experience}</td>
              <td>{emp.specializations.join(", ")}</td>
              <td>
                <button className="view-button" onClick={() => setSelectedEmployee(emp)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mitarbeiter-Detailansicht */}
      {selectedEmployee && (
        <div className="employee-details">
          <h2>{selectedEmployee.name} - {selectedEmployee.rank}</h2>
          <p><strong>Erfahrung:</strong> {selectedEmployee.experience}</p>
          <p><strong>Spezialisierungen:</strong> {selectedEmployee.specializations.join(", ")}</p>
          <h3>📂 Dokumente</h3>
          <ul>
            {selectedEmployee.documents.map((doc, index) => (
              <li key={index}><a href="#">{doc}</a></li>
            ))}
          </ul>
          <h3>🔑 Berechtigungen</h3>
          <p>{selectedEmployee.permissions.join(", ")}</p>
          <button onClick={() => setIsEditModalOpen(true)}>Bearbeiten</button>
          <button className="close-button" onClick={() => setSelectedEmployee(null)}>Schließen</button>
        </div>
      )}

      {/* Modal für neuen Mitarbeiter */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Neuer Mitarbeiter</h2>
            <input type="text" placeholder="Name" onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} />
            <input type="text" placeholder="Rang" onChange={(e) => setNewEmployee({ ...newEmployee, rank: e.target.value })} />
            <input type="text" placeholder="Erfahrung (Jahre)" onChange={(e) => setNewEmployee({ ...newEmployee, experience: e.target.value })} />
            <button onClick={addEmployee}>Speichern</button>
            <button onClick={() => setIsModalOpen(false)}>Abbrechen</button>
          </div>
        </div>
      )}

      {/* Modal für Bearbeitung */}
      {isEditModalOpen && selectedEmployee && (
        <div className="modal">
          <div className="modal-content">
            <h2>Mitarbeiter bearbeiten</h2>
            <input type="text" value={selectedEmployee.name} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })} />
            <input type="text" value={selectedEmployee.rank} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, rank: e.target.value })} />
            <input type="text" value={selectedEmployee.experience} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, experience: e.target.value })} />
            <button onClick={updateEmployee}>Speichern</button>
            <button onClick={() => setIsEditModalOpen(false)}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MechanicEmployees;
