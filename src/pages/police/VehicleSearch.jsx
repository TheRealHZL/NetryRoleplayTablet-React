import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/VehicleSearch.css";

const VehicleSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    // Simuliere eine API-Suche
    const mockVehicles = [
      {
        id: 1,
        licensePlate: "LS12345",
        model: "Dominator GTX",
        owner: "Max Mustermann",
        color: "Rot",
        insuranceStatus: "Aktiv",
        registrationDate: "01.01.2023",
      },
      {
        id: 2,
        licensePlate: "LS67890",
        model: "Elegy Retro Custom",
        owner: "Sarah Müller",
        color: "Blau",
        insuranceStatus: "Abgelaufen",
        registrationDate: "15.06.2022",
      },
    ];

    setVehicles(mockVehicles); // Ersetze dies durch einen API-Aufruf
  };

  const viewDetails = (id) => {
    navigate(`/police/vehicle-details/${id}`);
  };

  return (
    <div className="vehicle-search-container">
      <header className="vehicle-search-header">
        <h1>Fahrzeugsuche</h1>
        <p>Geben Sie Informationen ein, um nach einem Fahrzeug zu suchen.</p>
      </header>

      <div className="vehicle-search-form">
        <input
          type="text"
          placeholder="Kennzeichen oder Fahrzeugmodell eingeben..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Suchen
        </button>
      </div>

      {vehicles.length > 0 && (
        <div className="vehicle-results">
          <h2>Suchergebnisse</h2>
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>Kennzeichen</th>
                <th>Modell</th>
                <th>Besitzer</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.licensePlate}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.owner}</td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => viewDetails(vehicle.id)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VehicleSearch;
