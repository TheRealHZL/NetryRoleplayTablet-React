import React, { useState, useEffect } from "react";
import "./css/DispatchCenter.css";

const DispatchCenter = () => {
  const [staff, setStaff] = useState([]);
  const [statuses] = useState([
    { id: "10-2", label: "10-2", color: "#4CAF50" }, // Verfügbar
    { id: "10-5", label: "10-5", color: "#FF9800" }, // Unterwegs
    { id: "10-6", label: "10-6", color: "#E91E63" }, // Beschäftigt
    { id: "10-8", label: "10-8", color: "#2196F3" }, // Im Dienst
    { id: "Off-Duty", label: "Off-Duty", color: "#9E9E9E" } // Außer Dienst
  ]);
  
  const [vehicles] = useState([
    { id: "Ambulance", label: "🚑 Ambulance", icon: "🚑" },
    { id: "NEF", label: "🚑 NEF", icon: "🚑" },
    { id: "RTW", label: "🚑 RTW", icon: "🚑" },
    { id: "Brush", label: "🚒 Brush", icon: "🚒" },
    { id: "Engine", label: "🚒 Engine", icon: "🚒" }
  ]);
  
  const [units] = useState([
    { id: "Unit 1", label: "Unit 1" },
    { id: "Unit 2", label: "Unit 2" },
    { id: "Unit 3", label: "Unit 3" },
    { id: "Unit 4", label: "Unit 4" },
    { id: "Command", label: "Command" }
  ]);
  
  const [roles] = useState([
    { id: "Innen-/Außendienst", label: "Innen-/Außendienst" },
    { id: "Dispatch", label: "Dispatch" },
    { id: "Einsatzleitung", label: "Einsatzleitung" },
    { id: "Notarzt", label: "Notarzt" }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ 
    unit: "Unit 1", 
    status: "10-2", 
    role: "Innen-/Außendienst", 
    vehicle: "Ambulance",
    notes: ""
  });
  const [playerName, setPlayerName] = useState("");
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("unit");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Neue Notfalleinsätze für das Dashboard
  const [emergencyCalls, setEmergencyCalls] = useState([
    { id: 1, location: "Hauptstraße 25", type: "Verkehrsunfall", priority: "Hoch", assignedUnits: ["Unit 1"] },
    { id: 2, location: "Parkweg 7", type: "Medizinischer Notfall", priority: "Mittel", assignedUnits: [] }
  ]);

  // Fetch Staff + Player Name
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, nameRes] = await Promise.all([
          fetch(`https://${GetParentResourceName()}/getEMSStaff`).then(res => res.json()),
          fetch(`https://${GetParentResourceName()}/getSpielerName`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }).then(res => res.json()),
        ]);

        setStaff(staffRes);
        setPlayerName(nameRes);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        // Mock-Daten für Testzwecke
        setStaff([
          { id: 1, unit: "Unit 1", status: "10-2", role: "Notarzt", vehicle: "NEF", firstname: "Max", lastname: "Mustermann", notes: "Schicht bis 20:00" },
          { id: 2, unit: "Unit 2", status: "10-5", role: "Dispatch", vehicle: "Ambulance", firstname: "Anna", lastname: "Schmidt", notes: "" }
        ]);
        setPlayerName("Max Mustermann");
      }
    };

    fetchData();
    
    // Theme aus localStorage laden
    const savedTheme = localStorage.getItem("ems-dark-mode");
    if (savedTheme) {
      setDarkMode(savedTheme === "true");
    }
  }, []);
  
  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("ems-dark-mode", darkMode);
  }, [darkMode]);

  // Update Staff
  const handleUpdate = async (id, field, value) => {
    try {
      const response = await fetch(`https://${GetParentResourceName()}/updateEMSStaff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, field, value }),
      });

      if (response.ok) {
        setStaff(staff.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
      } else {
        console.error("Fehler beim Aktualisieren des Eintrags.");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren:", error);
      // Für Testzwecke direkt aktualisieren
      setStaff(staff.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    }
  };

  // Add Staff
  const handleAddStaff = async () => {
    if (!playerName.includes(" ")) {
      showNotification("Fehler: Spielername ungültig.");
      return;
    }

    const [firstName, lastName] = playerName.split(" ");

    try {
      const response = await fetch(`https://${GetParentResourceName()}/addEMSStaff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newEntry, firstname: firstName, lastname: lastName }),
      });

      if (response.ok) {
        const newStaff = await response.json();
        setStaff([...staff, newStaff]);
        setShowForm(false);
        showNotification("Personal erfolgreich eingetragen!");
      } else {
        console.error("Fehler beim Hinzufügen.");
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen:", error);
      // Für Testzwecke direkt hinzufügen
      const newStaffMember = {
        id: Math.max(...staff.map(s => s.id), 0) + 1,
        ...newEntry,
        firstname: firstName,
        lastname: lastName
      };
      setStaff([...staff, newStaffMember]);
      setShowForm(false);
      showNotification("Personal erfolgreich eingetragen!");
    }
  };

  // Remove Staff
  const handleRemoveStaff = async (id) => {
    try {
      const response = await fetch(`https://${GetParentResourceName()}/removeEMSStaff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setStaff(staff.filter((s) => s.id !== id));
        showNotification("Personal erfolgreich ausgetragen!");
      } else {
        console.error("Fehler beim Löschen des Eintrags.");
      }
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      // Für Testzwecke direkt löschen
      setStaff(staff.filter((s) => s.id !== id));
      showNotification("Personal erfolgreich ausgetragen!");
    }
  };
  
  // Benachrichtigungssystem
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }, 10);
  };
  
  // Sortierung
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };
  
  // Sortierte und gefilterte Mitarbeiter
  const filteredStaff = staff
    .filter(person => {
      if (!filter) return true;
      const searchTerm = filter.toLowerCase();
      return (
        person.unit.toLowerCase().includes(searchTerm) ||
        person.status.toLowerCase().includes(searchTerm) ||
        person.role.toLowerCase().includes(searchTerm) ||
        person.vehicle.toLowerCase().includes(searchTerm) ||
        `${person.firstname} ${person.lastname}`.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      if (a[sortBy] < b[sortBy]) {
        comparison = -1;
      } else if (a[sortBy] > b[sortBy]) {
        comparison = 1;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  
  const getStatusColor = (statusId) => {
    const status = statuses.find(s => s.id === statusId);
    return status ? status.color : "#9E9E9E";
  };
  
  const getVehicleIcon = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.icon : "🚑";
  };
  
  // Dashboard Statistiken
  const getStaffStats = () => {
    const total = staff.length;
    const onDuty = staff.filter(s => s.status !== "Off-Duty").length;
    const available = staff.filter(s => s.status === "10-2").length;
    
    return { total, onDuty, available };
  };
  
  const stats = getStaffStats();

  return (
    <div className={`dispatch-container ${darkMode ? 'dark-theme' : ''}`}>
      <div className="header">
        <h1>🚑 EMS Leitstelle</h1>
        <div className="header-controls">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button className="info-button" onClick={() => setShowStatusModal(true)}>ℹ️</button>
        </div>
      </div>
      
      <div className="dashboard">
        <div className="stats-panel">
          <div className="stat-card">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-info">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Personal gesamt</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-info">
              <div className="stat-value">{stats.onDuty}</div>
              <div className="stat-label">Im Dienst</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-value">{stats.available}</div>
              <div className="stat-label">Verfügbar</div>
            </div>
          </div>
        </div>
        
        <div className="emergency-panel">
          <h3>Aktuelle Einsätze</h3>
          <div className="emergency-list">
            {emergencyCalls.map(call => (
              <div key={call.id} className={`emergency-card priority-${call.priority.toLowerCase()}`}>
                <div className="emergency-header">
                  <span className="emergency-type">{call.type}</span>
                  <span className="emergency-priority">{call.priority}</span>
                </div>
                <div className="emergency-location">{call.location}</div>
                <div className="emergency-units">
                  {call.assignedUnits.length > 0 ? (
                    <>Zugewiesen: {call.assignedUnits.join(', ')}</>
                  ) : (
                    <span className="no-units">Keine Einheiten zugewiesen</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="controls">
        <button className="add-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? "❌ Abbrechen" : "➕ Eintragen"}
        </button>
        <div className="search-box">
          <input
            type="text"
            placeholder="Suchen..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search-input"
          />
          {filter && (
            <button className="clear-button" onClick={() => setFilter("")}>×</button>
          )}
        </div>
      </div>
      
      {showForm && (
        <div className="add-form-container">
          <div className="add-form">
            <h3>Personal eintragen</h3>
            <p>Eingeloggt als: <strong>{playerName}</strong></p>
            
            <div className="form-row">
              <div className="form-group">
                <label>Einheit</label>
                <select 
                  value={newEntry.unit}
                  onChange={(e) => setNewEntry({ ...newEntry, unit: e.target.value })}
                >
                  {units.map((u) => (<option key={u.id} value={u.id}>{u.label}</option>))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select 
                  value={newEntry.status}
                  onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value })}
                  style={{ backgroundColor: getStatusColor(newEntry.status) }}
                >
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Rolle</label>
                <select 
                  value={newEntry.role}
                  onChange={(e) => setNewEntry({ ...newEntry, role: e.target.value })}
                >
                  {roles.map((r) => (<option key={r.id} value={r.id}>{r.label}</option>))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Fahrzeug</label>
                <select 
                  value={newEntry.vehicle}
                  onChange={(e) => setNewEntry({ ...newEntry, vehicle: e.target.value })}
                >
                  {vehicles.map((v) => (<option key={v.id} value={v.id}>{v.label}</option>))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Notizen</label>
              <input
                type="text"
                placeholder="Schichtende, Qualifikationen, etc."
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              />
            </div>
            
            <button className="submit-button" onClick={handleAddStaff}>✅ Eintragen</button>
          </div>
        </div>
      )}
      
      {/* Haupt-Tabelle */}
      <div className="table-container">
        <table className="dispatch-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("unit")} className={sortBy === "unit" ? `sort-${sortDirection}` : ""}>
                Einheit
              </th>
              <th onClick={() => handleSort("status")} className={sortBy === "status" ? `sort-${sortDirection}` : ""}>
                Status
              </th>
              <th onClick={() => handleSort("role")} className={sortBy === "role" ? `sort-${sortDirection}` : ""}>
                Rolle
              </th>
              <th onClick={() => handleSort("vehicle")} className={sortBy === "vehicle" ? `sort-${sortDirection}` : ""}>
                Fahrzeug
              </th>
              <th onClick={() => handleSort("firstname")} className={sortBy === "firstname" ? `sort-${sortDirection}` : ""}>
                Personal
              </th>
              <th>Notizen</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((person) => (
              <tr key={person.id} className={`status-${person.status}`}>
                <td>
                  <select 
                    value={person.unit} 
                    onChange={(e) => handleUpdate(person.id, "unit", e.target.value)}
                    className="table-select"
                  >
                    {units.map((u) => (<option key={u.id} value={u.id}>{u.label}</option>))}
                  </select>
                </td>
                <td>
                  <select 
                    value={person.status} 
                    onChange={(e) => handleUpdate(person.id, "status", e.target.value)}
                    className="status-select"
                    style={{ backgroundColor: getStatusColor(person.status) }}
                  >
                    {statuses.map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
                  </select>
                </td>
                <td>
                  <select 
                    value={person.role} 
                    onChange={(e) => handleUpdate(person.id, "role", e.target.value)}
                    className="table-select"
                  >
                    {roles.map((r) => (<option key={r.id} value={r.id}>{r.label}</option>))}
                  </select>
                </td>
                <td>
                  <select 
                    value={person.vehicle} 
                    onChange={(e) => handleUpdate(person.id, "vehicle", e.target.value)}
                    className="table-select"
                  >
                    {vehicles.map((v) => (<option key={v.id} value={v.id}>{v.label}</option>))}
                  </select>
                </td>
                <td>{person.firstname} {person.lastname}</td>
                <td>
                  <input
                    type="text"
                    placeholder="Notizen hinzufügen..."
                    value={person.notes || ""}
                    onChange={(e) => handleUpdate(person.id, "notes", e.target.value)}
                    className="notes-input"
                  />
                </td>
                <td>
                  <button 
                    onClick={() => handleRemoveStaff(person.id)}
                    className="remove-button"
                  >
                    ❌ Austragen
                  </button>
                </td>
              </tr>
            ))}
            
            {filteredStaff.length === 0 && (
              <tr>
                <td colSpan="7" className="no-results">
                  Keine Einträge gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {showStatusModal && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Status-Codes</h3>
            <div className="status-legend">
              {statuses.map(status => (
                <div key={status.id} className="status-item">
                  <div className="status-color" style={{ backgroundColor: status.color }}></div>
                  <div className="status-code">{status.id}</div>
                  <div className="status-desc">
                    {status.id === "10-2" && "Verfügbar"}
                    {status.id === "10-5" && "Unterwegs zum Einsatz"}
                    {status.id === "10-6" && "Beschäftigt/Einsatz"}
                    {status.id === "10-8" && "Im Dienst"}
                    {status.id === "Off-Duty" && "Außer Dienst"}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowStatusModal(false)}>Schließen</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchCenter;