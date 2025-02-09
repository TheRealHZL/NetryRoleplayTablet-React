import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/PersonSearch.css";

const PersonSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    // Führe die API-Suche durch und aktualisiere die Suchergebnisse
    const results = [
      { id: 1, name: "John Doe", age: 34, address: "123 Main Street, Los Santos" },
      { id: 2, name: "Jane Smith", age: 28, address: "456 Elm Street, Los Santos" },
    ];
    setSearchResults(results);
  };

  const goToDetails = (person) => {
    navigate("/person-details", { state: { person } });
  };

  return (
    <div className="person-search-container">
      <header className="person-search-header">
        <h1>Personensuche</h1>
        <p>Geben Sie die Informationen ein, um nach einer Person zu suchen.</p>
      </header>

      <div className="person-search-form">
        <input
          type="text"
          placeholder="Name, Telefonnummer oder ID eingeben..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Suchen
        </button>
      </div>

      {searchResults.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Alter</th>
              <th>Adresse</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.age}</td>
                <td>{person.address}</td>
                <td>
                  <button onClick={() => goToDetails(person)} className="details-button">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PersonSearch;