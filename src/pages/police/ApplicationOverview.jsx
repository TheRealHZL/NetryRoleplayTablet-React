import React, { useState } from "react";
import "./css/ApplicationOverview.css";

const ApplicationOverview = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Max Mustermann",
      email: "max.mustermann@example.com",
      job: "Polizei",
      motivation: "Ich möchte der Stadt dienen und für Ordnung sorgen.",
      status: "Offen",
    },
    {
      id: 2,
      name: "Sarah Müller",
      email: "sarah.mueller@example.com",
      job: "Rettungsdienst",
      motivation: "Ich möchte Menschen in Not helfen.",
      status: "Offen",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    const updatedApplications = applications.map((app) =>
      app.id === id ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);
  };

  return (
    <div className="application-overview-container">
      <h1>Eingegangene Bewerbungen</h1>
      <div className="applications-list">
        {applications.map((app) => (
          <div key={app.id} className="application-card">
            <h3>{app.name}</h3>
            <p><strong>E-Mail:</strong> {app.email}</p>
            <p><strong>Wunschposition:</strong> {app.job}</p>
            <p><strong>Motivation:</strong> {app.motivation}</p>
            <p><strong>Status:</strong> {app.status}</p>
            <div className="actions">
              <button onClick={() => updateStatus(app.id, "Angenommen")}>
                Annehmen
              </button>
              <button onClick={() => updateStatus(app.id, "Abgelehnt")}>
                Ablehnen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationOverview;
