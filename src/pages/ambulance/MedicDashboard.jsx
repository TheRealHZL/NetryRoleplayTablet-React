import React, { useState } from "react";
import "./css/Dashboard.css";

const MedicDashboard = () => {
  const [dispatches, setDispatches] = useState([
    { id: 1, type: "Unfall", location: "Vinewood Blvd", priority: "Hoch", status: "Offen" },
    { id: 2, type: "Herzinfarkt", location: "Legion Square", priority: "Kritisch", status: "Abgeschlossen" },
  ]);

  const [vehicles, setVehicles] = useState([
    { id: 1, name: "Ambulanz 1", status: "Einsatzbereit" },
    { id: 2, name: "Ambulanz 2", status: "In Wartung" },
    { id: 3, name: "RTW 3", status: "Einsatzbereit" },
  ]);

  const [staff, setStaff] = useState([
    { id: 1, name: "Dr. Müller", status: "Einsatzbereit", shift: "08:00 - 16:00" },
    { id: 2, name: "Pflegekraft Schulz", status: "In Pause", shift: "12:00 - 20:00" },
    { id: 3, name: "Sanitäter Becker", status: "Einsatzbereit", shift: "10:00 - 18:00" },
  ]);

  const [calendar, setCalendar] = useState([
    { date: "12.02.2025", event: "Schulung: Notfallmanagement" },
    { date: "15.02.2025", event: "Erste-Hilfe-Kurs" },
  ]);

  return (
    <div className="medic-dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Rettungsdienst Dashboard</h1>
        <p>Alles auf einen Blick für den Rettungsdienst.</p>
      </header>

      {/* Statistiken */}
      <section className="dashboard-overview">
        <div className="overview-card">
          <h2>Aktive Dispatches</h2>
          <p>{dispatches.filter((d) => d.status === "Offen").length}</p>
        </div>
        <div className="overview-card">
          <h2>Verfügbare Fahrzeuge</h2>
          <p>{vehicles.filter((v) => v.status === "Einsatzbereit").length}</p>
        </div>
        <div className="overview-card">
          <h2>Kollegen im Dienst</h2>
          <p>{staff.filter((s) => s.status === "Einsatzbereit").length}</p>
        </div>
      </section>

      {/* Dispatchverwaltung */}
      <section className="dashboard-section">
        <h2>Dispatch-Verwaltung</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Art</th>
              <th>Ort</th>
              <th>Priorität</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {dispatches.map((dispatch) => (
              <tr key={dispatch.id}>
                <td>{dispatch.type}</td>
                <td>{dispatch.location}</td>
                <td>{dispatch.priority}</td>
                <td>{dispatch.status}</td>
                <td>
                  <button className="details-button">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Fahrzeugübersicht */}
      <section className="dashboard-section">
        <h2>Fahrzeugstatus</h2>
        <div className="vehicle-list">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="vehicle-card">
              <h3>{vehicle.name}</h3>
              <p><strong>Status:</strong> {vehicle.status}</p>
              <button className="status-button">Status ändern</button>
            </div>
          ))}
        </div>
      </section>

      {/* Kollegenübersicht */}
      <section className="dashboard-section">
        <h2>Kollegenübersicht</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Schicht</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.status}</td>
                <td>{member.shift}</td>
                <td>
                  <button className="details-button">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Kalender */}
      <section className="dashboard-section">
        <h2>Termine</h2>
        <div className="calendar-list">
          {calendar.map((event, index) => (
            <div key={index} className="calendar-card">
              <p><strong>Datum:</strong> {event.date}</p>
              <p><strong>Event:</strong> {event.event}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MedicDashboard;