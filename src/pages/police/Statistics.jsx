import React from "react";
import "./css/Statistics.css";

const Statistics = () => {
  const stats = {
    totalReports: 120,
    resolvedCases: 85,
    pendingCases: 35,
    mostCommonCrime: "Diebstahl",
  };

  const crimeData = [
    { type: "Diebstahl", count: 40 },
    { type: "Einbruch", count: 25 },
    { type: "Körperverletzung", count: 20 },
    { type: "Drogenhandel", count: 15 },
  ];

  return (
    <div className="statistics-container">
      <header className="statistics-header">
        <h1>Statistiken</h1>
      </header>

      <div className="statistics-overview">
        <div className="stat-card">
          <h3>Gesamtberichte</h3>
          <p>{stats.totalReports}</p>
        </div>
        <div className="stat-card">
          <h3>Aufgeklärte Fälle</h3>
          <p>{stats.resolvedCases}</p>
        </div>
        <div className="stat-card">
          <h3>Offene Fälle</h3>
          <p>{stats.pendingCases}</p>
        </div>
        <div className="stat-card">
          <h3>Häufigstes Verbrechen</h3>
          <p>{stats.mostCommonCrime}</p>
        </div>
      </div>

      <section className="crime-stats">
        <h2>Verbrechensübersicht</h2>
        <ul>
          {crimeData.map((crime, index) => (
            <li key={index}>
              <span>{crime.type}</span>
              <span>{crime.count}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Statistics;
