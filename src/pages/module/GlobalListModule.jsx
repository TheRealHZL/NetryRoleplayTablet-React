import React, { useState, useEffect, useRef } from "react";
import yaml from "js-yaml";
import "./css/list-module.css";

const GlobalListModule = ({ faction }) => {
  const [yamlData, setYamlData] = useState("");
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const batchSaveTimeout = useRef(null);

  useEffect(() => {
    fetchFactionSettings();
    fetchFactionEntries();
  }, [faction]);

  const fetchFactionSettings = async () => {
    try {
      const response = await fetch(`https://resource_name/getFactionSettings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faction }),
      });

      const result = await response.text();
      setYamlData(result);
      setData(yaml.load(result));
    } catch (error) {
      console.error(`Fehler beim Laden der ${faction}-Einstellungen:`, error);
    }
  };

  const fetchFactionEntries = async () => {
    try {
      const response = await fetch(`https://resource_name/getFactionEntries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faction }),
      });

      const result = await response.json();
      setEntries(result);
    } catch (error) {
      console.error(`Fehler beim Laden der ${faction}-Einträge:`, error);
    }
  };

  const handleChange = (field, value, index) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], value };
    setEntries(updatedEntries);

    if (batchSaveTimeout.current) clearTimeout(batchSaveTimeout.current);
    batchSaveTimeout.current = setTimeout(() => {
      handleBatchSave();
    }, 1000);
  };

  const handleBatchSave = async () => {
    await fetch(`https://resource_name/saveFactionEntry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ faction, data: entries }),
    });

    console.log(`${faction}-Daten gespeichert!`);
  };

  const handleAddEntry = () => {
    const newEntry = {};
    data.tabs[activeTab].sections[0].fields.forEach((field) => {
      newEntry[field.fieldName] = "";
    });

    setEntries([...entries, newEntry]);
  };

  const filteredEntries = entries.filter((entry) =>
    Object.values(entry).some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (!data) return <p>Lade {faction}-Daten...</p>;

  return (
    <div
      className="list-container"
      style={{
        width: data.layout.containerWidth,
        backgroundColor: data.layout.backgroundColor,
        color: data.layout.textColor,
        fontFamily: data.layout.fontFamily,
      }}
    >
      {/* Tabs */}
      <div className="tabs">
        {data.tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${index === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Suchfeld */}
      <div className="search-bar">
        <input
          type="text"
          placeholder={`Suche in ${faction}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Inhalt des aktiven Tabs */}
      <div className="tab-content">
        {data.tabs[activeTab].sections.map((section, secIndex) => (
          <div key={secIndex} className="list-section">
            <h2>{section.title}</h2>
            <div style={{ display: "grid", gridTemplateColumns: section.grid }}>
              {filteredEntries.map((entry, entryIndex) => (
                <div key={entryIndex} className="entry-row">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="form-field" style={{ width: field.width }}>
                      <label>{field.name}</label>
                      {field.type === "input" && (
                        <input
                          type="text"
                          value={entry[field.fieldName] || ""}
                          onChange={(e) => handleChange(field.fieldName, e.target.value, entryIndex)}
                        />
                      )}
                      {field.type === "checkbox" && (
                        <input
                          type="checkbox"
                          checked={entry[field.fieldName] || false}
                          onChange={(e) => handleChange(field.fieldName, e.target.checked, entryIndex)}
                        />
                      )}
                      {field.type === "date" && (
                        <input
                          type="date"
                          value={entry[field.fieldName] || ""}
                          onChange={(e) => handleChange(field.fieldName, e.target.value, entryIndex)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {section.allowAdding && <button onClick={handleAddEntry}>+ Neuer Eintrag</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalListModule;
