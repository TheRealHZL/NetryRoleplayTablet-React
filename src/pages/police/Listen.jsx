import React, { useState, useEffect } from "react";
import yaml from "js-yaml";
import "./css/list-module.css"; // Falls du eine CSS-Datei hast

const defaultYaml = `
trainings:
  - category: "Polizei Grundausbildung"
    trainers:
      - name: "Max Mustermann"
        rank: "Ausbilder"
        contact: "max@polizei.de"
      - name: "Lisa Schmidt"
        rank: "Hauptausbilder"
        contact: "lisa@polizei.de"

  - category: "Spezialeinheiten"
    trainers:
      - name: "Thomas Becker"
        rank: "SEK Trainer"
        contact: "thomas@polizei.de"
      - name: "Julia Weber"
        rank: "Sprengstoffexperte"
        contact: "julia@polizei.de"

  - category: "Fahrtraining"
    trainers:
      - name: "Michael Krause"
        rank: "Fahrlehrer"
        contact: "michael@polizei.de"
      - name: "Sandra Hoffmann"
        rank: "Rennfahrer"
        contact: "sandra@polizei.de"

  - category: "Schießtraining"
    trainers:
      - name: "Andreas Meier"
        rank: "Waffenausbilder"
        contact: "andreas@polizei.de"
      - name: "Sarah Lehmann"
        rank: "Schießlehrer"
        contact: "sarah@polizei.de"
`;

const TrainerList = ({ userRank }) => {
  const [yamlData, setYamlData] = useState(defaultYaml);
  const [data, setData] = useState(yaml.load(defaultYaml));
  const [newTrainer, setNewTrainer] = useState({ name: "", rank: "", contact: "", category: "" });

  useEffect(() => {
    const savedYaml = localStorage.getItem("trainerList");
    if (savedYaml) {
      setYamlData(savedYaml);
      setData(yaml.load(savedYaml));
    }
  }, []);

  const canManageTrainers = userRank >= 5; // Nur Admins können Trainer hinzufügen

  const handleAddTrainer = () => {
    if (!canManageTrainers || newTrainer.name.trim() === "" || newTrainer.category.trim() === "") return;

    const updatedTrainings = [...data.trainings];
    const trainingCategory = updatedTrainings.find(t => t.category === newTrainer.category);

    if (trainingCategory) {
      trainingCategory.trainers.push({
        name: newTrainer.name,
        rank: newTrainer.rank,
        contact: newTrainer.contact,
      });
    } else {
      updatedTrainings.push({
        category: newTrainer.category,
        trainers: [{ name: newTrainer.name, rank: newTrainer.rank, contact: newTrainer.contact }],
      });
    }

    const newYaml = yaml.dump({ trainings: updatedTrainings });

    setData({ trainings: updatedTrainings });
    setYamlData(newYaml);
    localStorage.setItem("trainerList", newYaml);
    setNewTrainer({ name: "", rank: "", contact: "", category: "" });
  };

  return (
    <div className="list-container">
      <h2 className="list-header">Trainingsliste</h2>

      {data.trainings.map((training, index) => (
        <div key={index} className="list-section">
          <h3>{training.category}</h3>
          <ul>
            {training.trainers.map((trainer, trainerIndex) => (
              <li key={trainerIndex} className="list-item">
                <strong>{trainer.name}</strong> - {trainer.rank} <br />
                📧 {trainer.contact}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Trainer hinzufügen (nur für Admins) */}
      {canManageTrainers && (
        <div className="add-trainer">
          <h3>Neuen Trainer hinzufügen</h3>
          <input
            type="text"
            placeholder="Name"
            value={newTrainer.name}
            onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Rang"
            value={newTrainer.rank}
            onChange={(e) => setNewTrainer({ ...newTrainer, rank: e.target.value })}
          />
          <input
            type="text"
            placeholder="Kontakt"
            value={newTrainer.contact}
            onChange={(e) => setNewTrainer({ ...newTrainer, contact: e.target.value })}
          />
          <input
            type="text"
            placeholder="Kategorie (z. B. Polizei Grundausbildung)"
            value={newTrainer.category}
            onChange={(e) => setNewTrainer({ ...newTrainer, category: e.target.value })}
          />
          <button onClick={handleAddTrainer}>+ Trainer hinzufügen</button>
        </div>
      )}

      <pre>{yamlData}</pre>
    </div>
  );
};

export default TrainerList;
