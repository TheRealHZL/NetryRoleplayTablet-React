import React, { useState, useEffect } from "react";
import { sendMedicalNuiMessage } from "./utils/medical_nui";
import "./css/PatientSearch.css";

const PatientSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const handleResults = (event) => {
      setPatients(event.detail);
    };

    window.addEventListener("patientSearchResultsReceived", handleResults);
    return () => {
      window.removeEventListener("patientSearchResultsReceived", handleResults);
    };
  }, []);

  const handleSearch = () => {
    sendMedicalNuiMessage("searchPatients", { query: searchQuery });
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

      {patients.length > 0 ? (
        <table className="patient-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Geburtsdatum</th>
              <th>Blutgruppe</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.firstname} {patient.lastname}</td>
                <td>{patient.dob}</td>
                <td>{patient.bloodType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Keine Patienten gefunden.</p>
      )}
    </div>
  );
};

export default PatientSearch;
