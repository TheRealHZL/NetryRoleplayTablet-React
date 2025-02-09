import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/PersonDetails.css";

const PersonDetails = () => {
  const [activeTab, setActiveTab] = useState("akten");
  const [modalOpen, setModalOpen] = useState(false);
  const [entries, setEntries] = useState({
    akten: [],
    vermerken: [],
  });
  const [newEntry, setNewEntry] = useState({ date: "", title: "", description: "", createdBy: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // API Call to fetch person data
    fetch("/api/person-details")
      .then((response) => response.json())
      .then((data) => {
        setEntries(data.entries);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Daten:", error);
        setLoading(false);
      });
  }, []);

  const switchTab = (tab) => setActiveTab(tab);

  const openModal = () => {
    setModalOpen(true);
    setNewEntry({ date: "", title: "", description: "", createdBy: "" });
  };

  const closeModal = () => setModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const addEntry = () => {
    const newEntries = [...entries[activeTab], newEntry];
    setEntries((prev) => ({
      ...prev,
      [activeTab]: newEntries,
    }));
    // Simulate API call to save new entry
    console.log("Eintrag gespeichert:", newEntry);
    closeModal();
  };

  if (loading) {
    return <div className="loading">Lade Daten...</div>;
  }

  return (
    <div className="person-details-container">
      {/* Header */}
      <header className="person-details-header">
        <h1>Details zu Max Mustermann</h1>
        <p>Alle relevanten Informationen auf einen Blick.</p>
      </header>

      {/* Personeninformationen */}
      <section className="details-overview">
        <div className="details-card">
          <h2>Personendaten</h2>
          <p><strong>Vorname:</strong> Max</p>
          <p><strong>Nachname:</strong> Mustermann</p>
          <p><strong>Geburtsdatum:</strong> 01.01.1990</p>
          <p><strong>Geschlecht:</strong> Männlich</p>
        </div>
        <div className="details-card">
          <h2>Lizenzen</h2>
          <ul>
            <li>Führerschein</li>
            <li>Motorradführerschein</li>
            <li>Waffenschein (ausstehend)</li>
          </ul>
        </div>
        <div className="details-card">
          <h2>Kontaktdaten</h2>
          <p><strong>Telefonnummer:</strong> 123456789</p>
          <p><strong>Adresse:</strong> Musterstraße 123, Los Santos</p>
        </div>
      </section>

      {/* Tabs für Akten und Vermerke */}
      <section className="details-tabs">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "akten" ? "active" : ""}`}
            onClick={() => switchTab("akten")}
          >
            Akten
          </button>
          <button
            className={`tab ${activeTab === "vermerken" ? "active" : ""}`}
            onClick={() => switchTab("vermerken")}
          >
            Vermerke
          </button>
        </div>
        <div className="tab-content">
          {entries[activeTab].map((entry, index) => (
            <div className="record-card" key={index}>
              <h3>{entry.date} - {entry.title}</h3>
              <p>{entry.description}</p>
              <p className="record-created-by">
                <strong>Bearbeiter:</strong> {entry.createdBy}
              </p>
            </div>
          ))}
          <button className="add-entry-btn" onClick={openModal}>+</button>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Neuer Eintrag</h2>
            <input
              type="text"
              name="date"
              placeholder="Datum (z.B. 01.01.2025)"
              value={newEntry.date}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="title"
              placeholder="Titel"
              value={newEntry.title}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="Beschreibung"
              value={newEntry.description}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="createdBy"
              placeholder="Bearbeiter (z.B. Officer Miller)"
              value={newEntry.createdBy}
              onChange={handleInputChange}
            />
            <div className="modal-buttons">
              <button onClick={addEntry}>Hinzufügen</button>
              <button onClick={closeModal}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {/* Zurück-Button */}
      <button className="back-button" onClick={() => navigate(-1)}>Zurück</button>
    </div>
  );
};

export default PersonDetails;
