import React, { useState } from "react";
import "./css/ReportManagement.css";

const ReportManagement = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Verhaftung von Max Mustermann",
      date: "10.02.2025",
      status: "Genehmigt",
    },
    {
      id: 2,
      title: "Unfallbericht - Vinewood Boulevard",
      date: "08.02.2025",
      status: "In Bearbeitung",
    },
  ]);

  const [newReport, setNewReport] = useState({ title: "", date: "", status: "In Bearbeitung" });
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!isModalOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({ ...prev, [name]: value }));
  };

  const addReport = () => {
    setReports([...reports, { id: Date.now(), ...newReport }]);
    setNewReport({ title: "", date: "", status: "In Bearbeitung" });
    toggleModal();
  };

  return (
    <div className="report-management-container">
      <header className="report-management-header">
        <h1>Berichtswesen</h1>
        <button className="add-report-btn" onClick={toggleModal}>
          Neuen Bericht erstellen
        </button>
      </header>

      <div className="report-list">
        {reports.map((report) => (
          <div key={report.id} className="report-card">
            <h3>{report.title}</h3>
            <p><strong>Datum:</strong> {report.date}</p>
            <p><strong>Status:</strong> {report.status}</p>
            <button className="details-btn">Details anzeigen</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Neuen Bericht erstellen</h2>
            <label>
              Titel:
              <input
                type="text"
                name="title"
                value={newReport.title}
                onChange={handleInputChange}
                placeholder="Berichtstitel eingeben"
              />
            </label>
            <label>
              Datum:
              <input
                type="date"
                name="date"
                value={newReport.date}
                onChange={handleInputChange}
              />
            </label>
            <div className="modal-actions">
              <button className="modal-add-btn" onClick={addReport}>Speichern</button>
              <button className="modal-cancel-btn" onClick={toggleModal}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;
