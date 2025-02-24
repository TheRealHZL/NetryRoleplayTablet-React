import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./css/PersonDetails.css";

const PersonDetails = () => {
  const location = useLocation();
  const person = location.state?.person;
  const [activeTab, setActiveTab] = useState("akten");
  const [entries, setEntries] = useState({ akten: [], vermerken: [] });
  const [newEntry, setNewEntry] = useState({ title: "", description: "" });

  useEffect(() => {
    if (!person) return;

    window.postMessage({ action: "getPersonDetails", citizenid: person.citizenid });

    const handlePersonDetails = (event) => {
      if (event.data.type === "personDetails") {
        setEntries({
          akten: event.data.details.filter(r => r.record_type === "akten"),
          vermerken: event.data.details.filter(r => r.record_type === "vermerken"),
        });
      }
    };

    window.addEventListener("message", handlePersonDetails);
    return () => window.removeEventListener("message", handlePersonDetails);
  }, [person]);

  const addEntry = () => {
    window.postMessage({
      action: "addRecord",
      record: {
        citizenid: person.citizenid,
        title: newEntry.title,
        description: newEntry.description,
        record_type: activeTab,
      },
    });

    setEntries((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], { ...newEntry, date: new Date().toLocaleDateString(), createdBy: "Du" }],
    }));

    setNewEntry({ title: "", description: "" });
  };

  return (
    <div className="person-details-container">
      <h1>{person?.firstname} {person?.lastname} - Details</h1>

      <section className="details-tabs">
        <div className="tabs">
          <button className={activeTab === "akten" ? "active" : ""} onClick={() => setActiveTab("akten")}>Akten</button>
          <button className={activeTab === "vermerken" ? "active" : ""} onClick={() => setActiveTab("vermerken")}>Vermerke</button>
        </div>

        <div className="tab-content">
          {entries[activeTab].map((entry, index) => (
            <div key={index} className="record-card">
              <h3>{entry.date} - {entry.title}</h3>
              <p>{entry.description}</p>
              <p><strong>Bearbeiter:</strong> {entry.created_by}</p>
            </div>
          ))}
        </div>

        <div className="add-entry-form">
          <input type="text" placeholder="Titel" value={newEntry.title} onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })} />
          <textarea placeholder="Beschreibung" value={newEntry.description} onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}></textarea>
          <button onClick={addEntry}>Hinzufügen</button>
        </div>
      </section>
    </div>
  );
};

export default PersonDetails;
