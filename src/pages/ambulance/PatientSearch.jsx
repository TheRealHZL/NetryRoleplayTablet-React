import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/PatientSearch.css";

const PatientSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([
    { id: 1, name: "Max Mustermann", dob: "01.01.1985", bloodType: "A+" },
    { id: 2, name: "Sarah Müller", dob: "15.03.1990", bloodType: "B-" },
  ]);

  const navigate = useNavigate();

  const handleSearch = () => {
    // Hier kann ein API-Aufruf integriert werden, um Patienten zu suchen
    console.log("Suchanfrage:", searchQuery);
  };

  const viewDetails = (id) => {
    navigate(`/medics/patient-details/${id}`);
  };

  return (
    <div className="patient-search-container">
      <header>
        <h1>Patientensuche</h1>
        <p>Finden Sie Patienten und rufen Sie deren Akten auf.</p>
      </header>

      <div className="search-form">
        <input
          type="text"
          placeholder="Name oder Geburtsdatum eingeben..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Suchen</button>
      </div>

      <table className="patient-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Geburtsdatum</th>
            <th>Blutgruppe</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.dob}</td>
              <td>{patient.bloodType}</td>
              <td>
                <button onClick={() => viewDetails(patient.id)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientSearch;
