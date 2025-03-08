import React, { useState, useEffect } from "react";
import "./css/DispatchCenter.css";

const DispatchCenter = () => {
  const [staff, setStaff] = useState([]);
  const [statuses, setStatuses] = useState(["10-2", "10-5", "10-6", "10-8", "Off-Duty"]);
  const [vehicles, setVehicles] = useState(["Ambulance", "NEF", "RTW", "Brush", "Engine"]);
  const [units, setUnits] = useState(["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Command"]);
  const [roles, setRoles] = useState(["Innen-/Außendienst", "Dispatch", "Einsatzleitung", "Notarzt"]);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ firstname: "", lastname: "", unit: "Unit 1", status: "10-2", role: "Innen-/Außendienst", vehicle: "Ambulance" });
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://${GetParentResourceName()}/getEMSStaff`);
      const data = await response.json();
      setStaff(data);
    };
    fetchData();

    const fetchPlayerName = async () => {
      const name = await getSpielerName();
      setPlayerName(name);
    };
    fetchPlayerName();
  }, []);

  const handleUpdate = async (id, field, value) => {
    await fetch(`https://${GetParentResourceName()}/updateEMSStaff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, field, value }),
    });
    setStaff(staff.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleAddStaff = async () => {
    const response = await fetch(`https://${GetParentResourceName()}/addEMSStaff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newEntry, firstname: playerName.split(" ")[0], lastname: playerName.split(" ")[1] }),
    });
    const newStaff = await response.json();
    setStaff([...staff, newStaff]);
    setShowForm(false);
  };

  const handleRemoveStaff = async (id) => {
    await fetch(`https://${GetParentResourceName()}/removeEMSStaff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setStaff(staff.filter((s) => s.id !== id));
  };

  return (
    <div className="dispatch-container">
      <h1>🚑 Leitstelle</h1>
      <button onClick={() => setShowForm(!showForm)}>➕ Eintragen</button>
      {showForm && (
        <div className="add-form">
          <p>Eingeloggt als: <strong>{playerName}</strong></p>
          <select onChange={(e) => setNewEntry({ ...newEntry, unit: e.target.value })}>
            {units.map((u) => (<option key={u} value={u}>{u}</option>))}
          </select>
          <select onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value })}>
            {statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
          <select onChange={(e) => setNewEntry({ ...newEntry, role: e.target.value })}>
            {roles.map((r) => (<option key={r} value={r}>{r}</option>))}
          </select>
          <select onChange={(e) => setNewEntry({ ...newEntry, vehicle: e.target.value })}>
            {vehicles.map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
          <button onClick={handleAddStaff}>✅ Eintragen</button>
        </div>
      )}
      <table className="dispatch-table">
        <thead>
          <tr>
            <th>Fahrzeug & Rang</th>
            <th>Status</th>
            <th>Arbeitsbereich</th>
            <th>Fahrzeug</th>
            <th>Name</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((person) => (
            <tr key={person.id}>
              <td>
                <select value={person.unit} onChange={(e) => handleUpdate(person.id, "unit", e.target.value)}>
                  {units.map((u) => (<option key={u} value={u}>{u}</option>))}
                </select>
              </td>
              <td>
                <select value={person.status} onChange={(e) => handleUpdate(person.id, "status", e.target.value)}>
                  {statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </td>
              <td>
                <select value={person.role} onChange={(e) => handleUpdate(person.id, "role", e.target.value)}>
                  {roles.map((r) => (<option key={r} value={r}>{r}</option>))}
                </select>
              </td>
              <td>
                <select value={person.vehicle} onChange={(e) => handleUpdate(person.id, "vehicle", e.target.value)}>
                  {vehicles.map((v) => (<option key={v} value={v}>{v}</option>))}
                </select>
              </td>
              <td>{person.firstname} {person.lastname}</td>
              <td><button onClick={() => handleRemoveStaff(person.id)}>❌ Austragen</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DispatchCenter;
