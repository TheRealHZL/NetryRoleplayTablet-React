import React, { useState } from "react";
import "./css/Leitstelle.css";

const Leitstelle = () => {
  const [statusGroups, setStatusGroups] = useState({
    "10-30 - Medizinischer Notfall": [],
    "10-5 - Frei": [],
    "10-87 - Nicht Einsatzbereit": [],
  });

  const [isModalOpen, setModalOpen] = useState(false);

  const [newEntry, setNewEntry] = useState({
    name: "",
    vehicle: "",
    status: "10-5 - Frei",
  });

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEntry = () => {
    const updatedGroups = { ...statusGroups };
    updatedGroups[newEntry.status].push({
      id: Date.now(),
      name: newEntry.name,
      vehicle: newEntry.vehicle,
      status: newEntry.status,
    });
    setStatusGroups(updatedGroups);
    toggleModal();
    setNewEntry({ name: "", vehicle: "", status: "10-5 - Frei" });
  };

  return (
    <div className="leitstelle-container">
      <header className="leitstelle-header">
        <h1>Leitstelle</h1>
        <div className="tabs">
          <button className="tab active">Leitstelle</button>
          <button className="tab">Dispatch Karte</button>
          <button className="tab">Wartezimmer KH</button>
          <button className="tab">Massenanfall von Verletzten</button>
        </div>
        <button className="add-entry-btn" onClick={toggleModal}>
          +
        </button>
      </header>

      <div className="leitstelle-content">
        {Object.keys(statusGroups).map((group, index) => (
          <div key={index} className="status-group-card">
            <h2 className="status-group-title">{group}</h2>
            <div className="status-group-entries">
              {statusGroups[group].map((entry) => (
                <div key={entry.id} className="status-entry">
                  <div>
                    <p className="entry-name">{entry.name}</p>
                    <p className="entry-vehicle">{entry.vehicle}</p>
                  </div>
                  <button className="details-btn">Details</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Eintrag hinzufügen</h2>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={newEntry.name}
                onChange={handleInputChange}
                placeholder="Name eingeben"
              />
            </label>
            <label>
              Fahrzeug:
              <input
                type="text"
                name="vehicle"
                value={newEntry.vehicle}
                onChange={handleInputChange}
                placeholder="Fahrzeug eingeben"
              />
            </label>
            <label>
              Status:
              <select
                name="status"
                value={newEntry.status}
                onChange={handleInputChange}
              >
                {Object.keys(statusGroups).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <div className="modal-actions">
              <button className="modal-add-btn" onClick={handleAddEntry}>
                Eintragen
              </button>
              <button className="modal-cancel-btn" onClick={toggleModal}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leitstelle;
