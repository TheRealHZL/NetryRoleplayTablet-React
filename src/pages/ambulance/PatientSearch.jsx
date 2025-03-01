import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { sendMedicalNuiMessage } from "./utils/medical_nui"; // ✅ FIXED IMPORT
import "./css/PatientSearch.css";

const PatientSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResults = (event) => {
      if (!event.data || event.data.type !== "searchResultsEMS") return;
      setPatients(event.data.results || []);
    };

    window.addEventListener("message", handleResults);
    return () => {
      window.removeEventListener("message", handleResults);
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const results = await sendMedicalNuiMessage("searchPatients", { query: searchQuery });
      if (results && Array.isArray(results)) {
        setPatients(results);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error("Fehler bei der Suche:", error);
      setPatients([]);
    }
  };

  const viewDetails = (id) => {
    navigate(`/ambulance/patientdetails/${id}`);
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
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.firstname} {patient.lastname}</td>
                <td>{patient.dob || "Unbekannt"}</td>
                <td>{patient.bloodType || "Unbekannt"}</td>
                <td>
                  <button onClick={() => viewDetails(patient.id)}>Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-results">🔎 Keine Patienten gefunden.</p>
      )}
    </div>
  );
};

export default PatientSearch;
