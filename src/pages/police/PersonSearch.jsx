import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendNuiMessage } from "./utils/nui";
import "./css/PersonSearch.css";

const PersonSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResults = (event) => {
      setSearchResults(event.detail);
    };

    window.addEventListener("searchResultsReceived", handleResults);
    return () => {
      window.removeEventListener("searchResultsReceived", handleResults);
    };
  }, []);

  const handleSearch = () => {
    sendNuiMessage("searchPerson", { query: searchQuery });
  };

  const goToDetails = (person) => {
    navigate("/person-details", { state: { person } });
  };

  return (
    <div className="person-search-container">
      <input
        type="text"
        placeholder="Name, Telefonnummer oder ID eingeben..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Suchen</button>

      {searchResults.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((person) => (
              <tr key={person.id}>
                <td>{person.firstname} {person.lastname}</td>
                <td><button onClick={() => goToDetails(person)}>Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PersonSearch;
