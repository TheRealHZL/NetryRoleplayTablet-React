import React, { useState, useEffect } from "react";
import "./css/Dashboard.css";

const MedicDashboard = () => {
  const [dispatches, setDispatches] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [staff, setStaff] = useState([]);
  const [calendar, setCalendar] = useState([]);

  // 📡 Daten von der API abrufen
  useEffect(() => {
    const fetchData = async () => {
      setDispatches(await sendNuiMessage("getDispatches") || []);
      setVehicles(await sendNuiMessage("getVehicles") || []);
      setStaff(await sendNuiMessage("getEMSStaff") || []);
      setCalendar(await sendNuiMessage("getCalendar") || []);
    };
    fetchData();
  }, []);

  // 📡 Kommunikation mit NUI
  const sendNuiMessage = async (event, data = {}) => {
    try {
      const response = await fetch(`https://${GetParentResourceName()}/${event}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`NUI Fetch Error: Server antwortete mit Status ${response.status}`);
      
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (err) {
      console.error("NUI Fetch Error:", err);
      return null;
    }
  };

  // 🚑 Dispatch-Status ändern
  const handleDispatchStatus = async (id, newStatus) => {
    await sendNuiMessage("updateDispatchStatus", { id, status: newStatus });
    setDispatches(dispatches.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  // 🚗 Fahrzeugstatus ändern
  const handleVehicleStatus = async (id, newStatus) => {
    await sendNuiMessage("updateVehicleStatus", { id, status: newStatus });
    setVehicles(vehicles.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  // 👨‍⚕️ Mitarbeiterstatus ändern
  const handleStaffStatus = async (id, newStatus) => {
    await sendNuiMessage("updateStaffStatus", { id, status: newStatus });
    setStaff(staff.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  return (
    <div className="medic-dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>🚑 Rettungsdienst Dashboard</h1>
        <p>Alles auf einen Blick für den Rettungsdienst.</p>
      </header>

      {/* Statistiken */}
      <section className="dashboard-overview">
        <div className="overview-card">
          <h2>Aktive Dispatches</h2>
          <p>{dispatches.filter(d => d.status === "Offen").length}</p>
        </div>
        <div className="overview-card">
          <h2>Verfügbare Fahrzeuge</h2>
          <p>{vehicles.filter(v => v.status === "Einsatzbereit").length}</p>
        </div>
        <div className="overview-card">
          <h2>Kollegen im Dienst</h2>
          <p>{staff.filter(s => s.status === "Einsatzbereit").length}</p>
        </div>
      </section>

      {/* Dispatchverwaltung */}
      <section className="dashboard-section">
        <h2>🚨 Dispatch-Verwaltung</h2>
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
            {dispatches.map(dispatch => (
              <tr key={dispatch.id}>
                <td>{dispatch.type}</td>
                <td>{dispatch.location}</td>
                <td>{dispatch.priority}</td>
                <td>
                  <select value={dispatch.status} onChange={(e) => handleDispatchStatus(dispatch.id, e.target.value)}>
                    <option value="Offen">Offen</option>
                    <option value="In Bearbeitung">In Bearbeitung</option>
                    <option value="Abgeschlossen">Abgeschlossen</option>
                  </select>
                </td>
                <td>
                  <button className="details-button">🔍 Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Fahrzeugübersicht */}
      <section className="dashboard-section">
        <h2>🚑 Fahrzeugstatus</h2>
        <div className="vehicle-list">
          {vehicles.map(vehicle => (
            <div key={vehicle.id} className="vehicle-card">
              <h3>{vehicle.name}</h3>
              <p><strong>Status:</strong> {vehicle.status}</p>
              <select onChange={(e) => handleVehicleStatus(vehicle.id, e.target.value)} value={vehicle.status}>
                <option value="Einsatzbereit">Einsatzbereit</option>
                <option value="In Wartung">In Wartung</option>
                <option value="Defekt">Defekt</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      {/* Kollegenübersicht */}
      <section className="dashboard-section">
        <h2>👨‍⚕️ Kollegenübersicht</h2>
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
            {staff.map(member => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>
                  <select value={member.status} onChange={(e) => handleStaffStatus(member.id, e.target.value)}>
                    <option value="Einsatzbereit">Einsatzbereit</option>
                    <option value="In Pause">In Pause</option>
                    <option value="Off-Duty">Off-Duty</option>
                  </select>
                </td>
                <td>{member.shift}</td>
                <td>
                  <button className="details-button">📋 Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Kalender */}
      <section className="dashboard-section">
        <h2>📅 Termine</h2>
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
