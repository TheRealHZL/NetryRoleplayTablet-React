import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { useFivemApi } from "./useFivemApi";

const factions = ["Mechaniker", "Polizei", "Rettungsdienst", "Admin"];

export default function YamlEditor() {
  const [selectedFaction, setSelectedFaction] = useState("Mechaniker");
  const [yamlContent, setYamlContent] = useState("");
  const { getYamlSettings, saveYamlSettings } = useFivemApi();

  useEffect(() => {
    getYamlSettings(selectedFaction, setYamlContent);
  }, [selectedFaction]);

  const handleSave = () => {
    saveYamlSettings(selectedFaction, yamlContent, (success) => {
      alert(success ? "Gespeichert!" : "Fehler beim Speichern!");
    });
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin: YAML-Editor</h2>
      <select className="admin-select" value={selectedFaction} onChange={(e) => setSelectedFaction(e.target.value)}>
        {factions.map((faction) => (
          <option key={faction} value={faction}>
            {faction}
          </option>
        ))}
      </select>
      <div className="admin-editor-container">
        <CodeMirror value={yamlContent} height="400px" extensions={[yaml()]} onChange={(value) => setYamlContent(value)} />
      </div>
      <button className="admin-button" onClick={handleSave}>
        Speichern
      </button>
    </div>
  );
}
