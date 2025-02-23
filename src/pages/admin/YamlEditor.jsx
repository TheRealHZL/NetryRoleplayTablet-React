import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { useFivemApi } from "./useFivemApi";

export default function YamlEditor() {
  const [factions, setFactions] = useState([]);
  const [selectedFaction, setSelectedFaction] = useState("");
  const [yamlContent, setYamlContent] = useState("");
  const { getAvailableFactions, getYamlSettings, saveYamlSettings } = useFivemApi();

  useEffect(() => {
    getAvailableFactions(setFactions);
  }, []);

  useEffect(() => {
    if (selectedFaction) {
      getYamlSettings(selectedFaction, setYamlContent);
    }
  }, [selectedFaction]);

  const handleSave = () => {
    saveYamlSettings(selectedFaction, yamlContent, (success) => {
      alert(success ? "Gespeichert!" : "Fehler beim Speichern!");
    });
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin: YAML-Editor</h2>
      <select
        className="admin-select"
        value={selectedFaction}
        onChange={(e) => setSelectedFaction(e.target.value)}
      >
        <option value="" disabled>Fraktion wählen...</option>
        {factions.map((faction) => (
          <option key={faction} value={faction}>
            {faction}
          </option>
        ))}
      </select>
      <div className="admin-editor-container">
        <CodeMirror
          value={yamlContent}
          height="400px"
          extensions={[yaml()]}
          onChange={(value) => setYamlContent(value)}
        />
      </div>
      <button className="admin-button" onClick={handleSave} disabled={!selectedFaction}>
        Speichern
      </button>
    </div>
  );
}
