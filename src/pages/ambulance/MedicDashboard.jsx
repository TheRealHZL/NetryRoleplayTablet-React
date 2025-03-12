import React, { useState, useEffect } from "react";
import { AlertCircle, Truck, Users, Calendar, CheckCircle, X, Clock, Activity } from "lucide-react";
import "./css/Dashboard.css";

const MedicDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dispatches, setDispatches] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [staff, setStaff] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Daten von der API abrufen
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        setDispatches(await sendNuiMessage("getDispatches") || []);
        setVehicles(await sendNuiMessage("getVehicles") || []);
        setStaff(await sendNuiMessage("getEMSStaff") || []);
        setCalendar(await sendNuiMessage("getCalendar") || []);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Regelmäßiges Update alle 30 Sekunden
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Kommunikation mit NUI
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

  // Dispatch-Status ändern
  const handleDispatchStatus = async (id, newStatus) => {
    await sendNuiMessage("updateDispatchStatus", { id, status: newStatus });
    setDispatches(dispatches.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  // Fahrzeugstatus ändern
  const handleVehicleStatus = async (id, newStatus) => {
    await sendNuiMessage("updateVehicleStatus", { id, status: newStatus });
    setVehicles(vehicles.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  // Mitarbeiterstatus ändern
  const handleStaffStatus = async (id, newStatus) => {
    await sendNuiMessage("updateStaffStatus", { id, status: newStatus });
    setStaff(staff.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  // Status-Badge mit passender Farbe
  const StatusBadge = ({ status }) => {
    let badgeClass = "medic-status-badge medic-status-default";
    let icon = null;
    
    switch(status) {
      case "Offen":
      case "Einsatzbereit":
        badgeClass = "medic-status-badge medic-status-success";
        icon = <CheckCircle className="medic-status-icon" />;
        break;
      case "In Bearbeitung":
      case "In Pause":
        badgeClass = "medic-status-badge medic-status-processing";
        icon = <Clock className="medic-status-icon" />;
        break;
      case "Abgeschlossen":
        badgeClass = "medic-status-badge medic-status-completed";
        icon = <Activity className="medic-status-icon" />;
        break;
      case "Defekt":
      case "Off-Duty":
        badgeClass = "medic-status-badge medic-status-error";
        icon = <X className="medic-status-icon" />;
        break;
      case "In Wartung":
        badgeClass = "medic-status-badge medic-status-warning";
        icon = <Clock className="medic-status-icon" />;
        break;
    }
    
    return (
      <div className={badgeClass}>
        {icon}
        {status}
      </div>
    );
  };

  // Prioritäts-Badge mit passender Farbe
  const PriorityBadge = ({ priority }) => {
    let badgeClass = "medic-priority-badge medic-priority-default";
    
    switch(priority) {
      case "Hoch":
        badgeClass = "medic-priority-badge medic-priority-high";
        break;
      case "Mittel":
        badgeClass = "medic-priority-badge medic-priority-medium";
        break;
      case "Niedrig":
        badgeClass = "medic-priority-badge medic-priority-low";
        break;
    }
    
    return (
      <div className={badgeClass}>
        {priority}
      </div>
    );
  };

  // Loading Component
  if (isLoading) {
    return (
      <div className="medic-loading-container">
        <div className="medic-loading-content">
          <div className="medic-spinner"></div>
          <p className="medic-loading-text">Lade Rettungsdienst-Daten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medic-dashboard">
      {/* Header mit Gradient und Logo */}
      <header className="medic-dashboard-header">
        <div className="medic-container">
          <div className="medic-header-content">
            <div>
              <h1 className="medic-header-title">
                <span className="medic-emoji">🚑</span> Rettungsdienst Dashboard
              </h1>
              <p className="medic-header-subtitle">Einsatzmanagement System</p>
            </div>
            <div className="medic-header-time">
              <p className="medic-current-time">{new Date().toLocaleTimeString()}</p>
              <p className="medic-current-date">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="medic-nav-container">
        <div className="medic-container">
          <div className="medic-nav-tabs">
            <button 
              onClick={() => setActiveTab("overview")} 
              className={`medic-nav-tab ${activeTab === "overview" ? "medic-nav-tab-active" : ""}`}
            >
              <Activity className="medic-nav-icon" />
              Übersicht
            </button>
            <button 
              onClick={() => setActiveTab("dispatches")} 
              className={`medic-nav-tab ${activeTab === "dispatches" ? "medic-nav-tab-active" : ""}`}
            >
              <AlertCircle className="medic-nav-icon" />
              Einsätze
            </button>
            <button 
              onClick={() => setActiveTab("vehicles")} 
              className={`medic-nav-tab ${activeTab === "vehicles" ? "medic-nav-tab-active" : ""}`}
            >
              <Truck className="medic-nav-icon" />
              Fahrzeuge
            </button>
            <button 
              onClick={() => setActiveTab("staff")} 
              className={`medic-nav-tab ${activeTab === "staff" ? "medic-nav-tab-active" : ""}`}
            >
              <Users className="medic-nav-icon" />
              Personal
            </button>
            <button 
              onClick={() => setActiveTab("calendar")} 
              className={`medic-nav-tab ${activeTab === "calendar" ? "medic-nav-tab-active" : ""}`}
            >
              <Calendar className="medic-nav-icon" />
              Kalender
            </button>
          </div>
        </div>
      </div>

      <div className="medic-main-content medic-container">
        {/* Übersicht Tab */}
        {activeTab === "overview" && (
          <div>
            {/* Status-Karten */}
            <div className="medic-status-cards">
              <div className="medic-status-card">
                <div className="medic-status-icon-container medic-status-icon-emergency">
                  <AlertCircle className="medic-status-card-icon" />
                </div>
                <div>
                  <p className="medic-status-label">Offene Einsätze</p>
                  <p className="medic-status-value">{dispatches.filter(d => d.status === "Offen").length}</p>
                </div>
              </div>
              
              <div className="medic-status-card">
                <div className="medic-status-icon-container medic-status-icon-active">
                  <AlertCircle className="medic-status-card-icon" />
                </div>
                <div>
                  <p className="medic-status-label">Laufende Einsätze</p>
                  <p className="medic-status-value">{dispatches.filter(d => d.status === "In Bearbeitung").length}</p>
                </div>
              </div>
              
              <div className="medic-status-card">
                <div className="medic-status-icon-container medic-status-icon-vehicle">
                  <Truck className="medic-status-card-icon" />
                </div>
                <div>
                  <p className="medic-status-label">Verfügbare Fahrzeuge</p>
                  <p className="medic-status-value">{vehicles.filter(v => v.status === "Einsatzbereit").length}</p>
                </div>
              </div>
              
              <div className="medic-status-card">
                <div className="medic-status-icon-container medic-status-icon-staff">
                  <Users className="medic-status-card-icon" />
                </div>
                <div>
                  <p className="medic-status-label">Personal im Dienst</p>
                  <p className="medic-status-value">{staff.filter(s => s.status === "Einsatzbereit").length}</p>
                </div>
              </div>
            </div>
            
            {/* Aktuelle Einsätze */}
            <div className="medic-panel">
              <h2 className="medic-panel-title">Aktuelle Einsätze</h2>
              {dispatches.filter(d => d.status !== "Abgeschlossen").length > 0 ? (
                <div className="medic-table-container">
                  <table className="medic-data-table">
                    <thead>
                      <tr>
                        <th>Art</th>
                        <th>Ort</th>
                        <th>Priorität</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dispatches.filter(d => d.status !== "Abgeschlossen").slice(0, 5).map(dispatch => (
                        <tr key={dispatch.id}>
                          <td>{dispatch.type}</td>
                          <td>{dispatch.location}</td>
                          <td>
                            <PriorityBadge priority={dispatch.priority} />
                          </td>
                          <td>
                            <StatusBadge status={dispatch.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="medic-no-data">Keine aktiven Einsätze vorhanden</p>
              )}
            </div>
            
            {/* Fahrzeug- und Personalübersicht */}
            <div className="medic-two-column">
              <div className="medic-panel">
                <h2 className="medic-panel-title">Fahrzeugübersicht</h2>
                <div className="medic-card-grid">
                  {vehicles.slice(0, 4).map(vehicle => (
                    <div key={vehicle.id} className="medic-info-card">
                      <div className="medic-info-card-header">
                        <h3 className="medic-info-card-title">{vehicle.name}</h3>
                        <div className="medic-emoji-icon">🚑</div>
                      </div>
                      <div className="medic-info-card-badge">
                        <StatusBadge status={vehicle.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="medic-panel">
                <h2 className="medic-panel-title">Personalübersicht</h2>
                <div className="medic-card-grid">
                  {staff.slice(0, 4).map(member => (
                    <div key={member.id} className="medic-info-card">
                      <div className="medic-info-card-header">
                        <h3 className="medic-info-card-title">{member.name}</h3>
                        <div className="medic-emoji-icon">👨‍⚕️</div>
                      </div>
                      <div className="medic-info-card-badge">
                        <StatusBadge status={member.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Einsätze Tab */}
        {activeTab === "dispatches" && (
          <div className="medic-panel">
            <div className="medic-panel-header">
              <h2 className="medic-panel-title">Einsatzübersicht</h2>
              <button className="medic-primary-button">
                <span className="medic-plus-icon">+</span> Neuer Einsatz
              </button>
            </div>
            
            {/* Filter */}
            <div className="medic-filter-tabs">
              <button className="medic-filter-tab medic-filter-tab-active">Alle</button>
              <button className="medic-filter-tab">Offen</button>
              <button className="medic-filter-tab">In Bearbeitung</button>
              <button className="medic-filter-tab">Abgeschlossen</button>
            </div>
            
            <div className="medic-table-container">
              <table className="medic-data-table">
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
                      <td>
                        <PriorityBadge priority={dispatch.priority} />
                      </td>
                      <td>
                        <select 
                          value={dispatch.status} 
                          onChange={(e) => handleDispatchStatus(dispatch.id, e.target.value)}
                          className="medic-status-select"
                        >
                          <option value="Offen">Offen</option>
                          <option value="In Bearbeitung">In Bearbeitung</option>
                          <option value="Abgeschlossen">Abgeschlossen</option>
                        </select>
                      </td>
                      <td>
                        <button className="medic-secondary-button">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fahrzeuge Tab */}
        {activeTab === "vehicles" && (
          <div>
            <div className="medic-panel">
              <div className="medic-panel-header">
                <h2 className="medic-panel-title">Fahrzeugverwaltung</h2>
                <button className="medic-primary-button">
                  <span className="medic-plus-icon">+</span> Neues Fahrzeug
                </button>
              </div>
              
              <div className="medic-vehicle-grid">
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} className="medic-vehicle-card">
                    <div className="medic-vehicle-card-header">
                      <h3 className="medic-vehicle-card-title">{vehicle.name}</h3>
                      <div className="medic-emoji-icon">🚑</div>
                    </div>
                    <div className="medic-vehicle-card-badge">
                      <StatusBadge status={vehicle.status} />
                    </div>
                    <div className="medic-vehicle-card-status">
                      <label className="medic-status-label">Status ändern</label>
                      <select 
                        onChange={(e) => handleVehicleStatus(vehicle.id, e.target.value)} 
                        value={vehicle.status}
                        className="medic-status-select"
                      >
                        <option value="Einsatzbereit">Einsatzbereit</option>
                        <option value="In Wartung">In Wartung</option>
                        <option value="Defekt">Defekt</option>
                      </select>
                    </div>
                    <div className="medic-vehicle-card-actions">
                      <button className="medic-secondary-button">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Personal Tab */}
        {activeTab === "staff" && (
          <div className="medic-panel">
            <div className="medic-panel-header">
              <h2 className="medic-panel-title">Personalverwaltung</h2>
              <div className="medic-button-group">
                <button className="medic-primary-button">
                  <span className="medic-plus-icon">+</span> Neuer Mitarbeiter
                </button>
                <button className="medic-secondary-button">
                  Dienstplan
                </button>
              </div>
            </div>
            
            <div className="medic-table-container">
              <table className="medic-data-table">
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
                      <td>
                        <div className="medic-staff-profile">
                          <div className="medic-staff-avatar">
                            {member.name.charAt(0)}
                          </div>
                          <div className="medic-staff-info">
                            <div className="medic-staff-name">{member.name}</div>
                            <div className="medic-staff-role">Sanitäter</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <select 
                          value={member.status} 
                          onChange={(e) => handleStaffStatus(member.id, e.target.value)}
                          className="medic-status-select"
                        >
                          <option value="Einsatzbereit">Einsatzbereit</option>
                          <option value="In Pause">In Pause</option>
                          <option value="Off-Duty">Off-Duty</option>
                        </select>
                      </td>
                      <td>
                        <div className="medic-staff-shift">{member.shift}</div>
                      </td>
                      <td>
                        <button className="medic-secondary-button">
                          Kontakt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Kalender Tab */}
        {activeTab === "calendar" && (
          <div className="medic-panel">
            <div className="medic-panel-header">
              <h2 className="medic-panel-title">Terminkalender</h2>
              <button className="medic-primary-button">
                <span className="medic-plus-icon">+</span> Neuer Termin
              </button>
            </div>
            
            <div className="medic-calendar-list">
              {calendar.map((event, index) => (
                <div key={index} className="medic-calendar-item">
                  <div className="medic-calendar-info">
                    <div className="medic-calendar-date">{event.date}</div>
                    <div className="medic-calendar-title">{event.event}</div>
                  </div>
                  <div className="medic-calendar-actions">
                    <button className="medic-secondary-button">
                      Bearbeiten
                    </button>
                    <button className="medic-danger-button">
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
              {calendar.length === 0 && (
                <p className="medic-no-data">Keine Termine vorhanden</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicDashboard;