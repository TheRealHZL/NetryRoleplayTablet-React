import React, { useEffect, useState } from "react";
import "./css/Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSpielerName } from "./utils/nui"; // Die Funktion, die den Namen holt
import {
  faClipboardList,
  faUsers,
  faBell,
  faCalendar,
  faMapMarkedAlt,
} from "@fortawesome/free-solid-svg-icons";

const PoliceDashboard = () => {
  const [playerName, setPlayerName] = useState("Lädt...");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const name = await getSpielerName();
        setPlayerName(name);
      } catch (err) {
        console.error("Fehler beim Laden des Spielernamens:", err);
        setError("Fehler beim Laden des Namens.");
      }
    }

    fetchData();

    // Event Listener für NUI-Callbacks
    const handleMessage = (event) => {
      if (event.data.action === "setPlayerName") {
        setPlayerName(event.data.name);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="pd-dashboard">
      <header className="pd-dashboard-header">
        <div className="header-welcome">
          {error ? (
            <h1 style={{ color: "red" }}>{error}</h1>
          ) : (
            <h1>Willkommen zurück, {playerName}!</h1>
          )}
          <p>Bleibe informiert und organisiert.</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <FontAwesomeIcon icon={faClipboardList} className="stat-icon" />
            <h3>Dispatches</h3>
            <p>12</p>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faUsers} className="stat-icon" />
            <h3>Kollegen online</h3>
            <p>24</p>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faBell} className="stat-icon" />
            <h3>Alarme</h3>
            <p>3 aktiv</p>
          </div>
        </div>
      </header>
      <main className="pd-dashboard-main">
        <section className="dashboard-section">
          <h2>Kommende Termine</h2>
          <div className="info-card">
            <FontAwesomeIcon icon={faCalendar} className="info-icon" />
            <div>
              <p>Nächster EH-Kurs</p>
              <p className="info-highlight">25. Mai 2025</p>
            </div>
          </div>
        </section>
        <section className="dashboard-section">
          <h2>Dispatch Übersicht</h2>
          <table className="dispatch-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Art</th>
                <th>Ort</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>02344</td>
                <td>Einbruch</td>
                <td>Paleto Bay</td>
                <td className="status-open">Offen</td>
              </tr>
              <tr>
                <td>02345</td>
                <td>Verfolgung</td>
                <td>Vinewood</td>
                <td className="status-progress">In Bearbeitung</td>
              </tr>
              <tr>
                <td>02346</td>
                <td>Schießerei</td>
                <td>Davis</td>
                <td className="status-complete">Abgeschlossen</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="dashboard-section">
          <h2>Kartenansicht</h2>
          <div className="map-preview">
            <FontAwesomeIcon icon={faMapMarkedAlt} className="map-icon" />
            <p>Karte öffnen</p>
          </div>
        </section>
      </main>
      <footer className="pd-dashboard-footer">
        <p>Polizei-Dashboard © 2025</p>
      </footer>
    </div>
  );
};

export default PoliceDashboard;
