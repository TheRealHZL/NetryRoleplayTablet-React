import React from "react";
import "./css/Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faUsers, faLaptop } from "@fortawesome/free-solid-svg-icons";

const PoliceDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-image">
          <img
            src="https://via.placeholder.com/800x200" // Placeholder, ersetze mit deinem Bild
            alt="Header Background"
          />
        </div>
        <div className="header-text">
          <h1>Hallo Sebastian</h1>
          <p>Willkommen im Dienst</p>
        </div>
      </header>

      {/* Statistische Übersicht */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>Offene Dispatches</h2>
          <p>255</p>
          <FontAwesomeIcon icon={faClipboard} className="stat-icon" />
        </div>
        <div className="stat-card">
          <h2>Kollegen im Dienst</h2>
          <p>255</p>
          <FontAwesomeIcon icon={faUsers} className="stat-icon" />
        </div>
        <div className="stat-card">
          <h2>Nächster Termin</h2>
          <p>EH Kurs<br />25.05.2025</p>
          <FontAwesomeIcon icon={faLaptop} className="stat-icon" />
        </div>
      </div>

      {/* Dispatch Tabelle */}
      <div className="dashboard-table">
        <table>
          <thead>
            <tr>
              <th>Dispatch ID</th>
              <th>Einsatzart</th>
              <th>Alarmierung</th>
              <th>Telefonnummer</th>
              <th>In Bearbeitung</th>
              <th>GPS Setzen</th>
              <th>Löschen</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>02344</td>
              <td>Development</td>
              <td>Cash on delivered</td>
              <td>37525478</td>
              <td><button className="btn-blue">Ja</button></td>
              <td><button className="btn-green">Setzen</button></td>
              <td><button className="btn-red">Löschen</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PoliceDashboard;
