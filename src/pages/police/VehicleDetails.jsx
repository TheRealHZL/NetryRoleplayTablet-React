import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/VehicleDetails.css";

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simuliere API-Aufruf für Fahrzeugdetails
    const mockVehicle = {
      id,
      licensePlate: "LS12345",
      model: "Dominator GTX",
      owner: "Max Mustermann",
      color: "Rot",
      insuranceStatus: "Aktiv",
      registrationDate: "01.01.2023",
      notes: [
        { date: "01.05.2023", text: "Verstoß gegen die Straßenverkehrsordnung" },
        { date: "15.07.2023", text: "Abgelaufener TÜV festgestellt" },
      ],
    };

    setVehicle(mockVehicle); // Ersetze dies durch einen API-Aufruf
  }, [id]);

  if (!vehicle) {
    return <div>Lade Fahrzeugdetails...</div>;
  }

  return (
    <div className="vehicle-details-container">
      <header className="vehicle-details-header">
        <h1>Details zu {vehicle.licensePlate}</h1>
        <p>Fahrzeuginformationen und relevante Einträge.</p>
      </header>

      <div className="details-overview">
        <div className="details-card">
          <h2>Fahrzeugdaten</h2>
          <p><strong>Modell:</strong> {vehicle.model}</p>
          <p><strong>Farbe:</strong> {vehicle.color}</p>
          <p><strong>Versicherungsstatus:</strong> {vehicle.insuranceStatus}</p>
          <p><strong>Registrierungsdatum:</strong> {vehicle.registrationDate}</p>
        </div>
        <div className="details-card">
          <h2>Besitzerdaten</h2>
          <p><strong>Besitzer:</strong> {vehicle.owner}</p>
        </div>
      </div>

      <section className="notes-section">
        <h2>Notizen</h2>
        <ul className="notes-list">
          {vehicle.notes.map((note, index) => (
            <li key={index}>
              <strong>{note.date}:</strong> {note.text}
            </li>
          ))}
        </ul>
      </section>

      <button className="back-button" onClick={() => navigate(-1)}>
        Zurück
      </button>
    </div>
  );
};

export default VehicleDetails;
