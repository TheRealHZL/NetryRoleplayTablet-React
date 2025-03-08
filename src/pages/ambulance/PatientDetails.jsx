import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/PatientDetails.css";

const Modal = ({ isOpen, title, children, onSave, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✖
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn-save" onClick={onSave}>
            Speichern
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [medicalNotes, setMedicalNotes] = useState([]);
  const [psychologicalRecords, setPsychologicalRecords] = useState([]);
  const [medicalInformation, setMedicalInformation] = useState({});
  const [contactDetails, setContactDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [isPsychModalOpen, setIsPsychModalOpen] = useState(false);
  const [isEditMedicalModalOpen, setIsEditMedicalModalOpen] = useState(false);
  const [isEditPsychModalOpen, setIsEditPsychModalOpen] = useState(false);
  const [editedContactDetails, setEditedContactDetails] = useState({});
  const [newMedicalRecord, setNewMedicalRecord] = useState({
    diagnosis: "",
    treatment: "",
  });
  const [newPsychRecord, setNewPsychRecord] = useState({
    diagnosis: "",
    treatment: "",
  });
  const [editMedicalRecord, setEditMedicalRecord] = useState(null);
  const [editPsychRecord, setEditPsychRecord] = useState(null);

  const sendNuiMessage = async (event, data = {}) => {
    try {
      const response = await fetch(
        `https://${GetParentResourceName()}/${event}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(
          `NUI Fetch Error: Server antwortete mit Status ${response.status}`
        );
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (err) {
      console.error("NUI Fetch Error:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setMedicalInformation(
        (await sendNuiMessage("getMedicalInformation", { citizenid: id })) || {}
      );
      setMedicalRecords(
        (await sendNuiMessage("getMedicalRecords", { citizenid: id })) || []
      );
      setMedicalNotes(
        (await sendNuiMessage("getMedicalNotes", { citizenid: id })) || []
      );
      setPsychologicalRecords(
        (await sendNuiMessage("getPsychologicalRecords", { citizenid: id })) ||
          []
      );
      setContactDetails(
        (await sendNuiMessage("getContactDetails", { citizenid: id })) || {}
      );
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const addedNote = await sendNuiMessage("addMedicalNote", {
      citizenid: id,
      note: newNote,
    });
    setMedicalNotes([...medicalNotes, addedNote]);
    setNewNote("");
  };

  const handleDeleteNote = async (noteId) => {
    await sendNuiMessage("deleteMedicalNote", { noteId });
    setMedicalNotes(medicalNotes.filter((note) => note.id !== noteId));
  };

  const handleAddMedicalRecord = async () => {
    const newRecord = {
      citizenid: id,
      title: "Neue Diagnose",
      description: "Details hier",
      created_by: "Du",
    };
    const addedRecord = await sendNuiMessage("createMedicalRecord", newRecord);
    setMedicalRecords([...medicalRecords, addedRecord]);
  };

  const handleDeleteMedicalRecord = async (recordId) => {
    await sendNuiMessage("deleteMedicalRecord", { recordId });
    setMedicalRecords(
      medicalRecords.filter((record) => record.id !== recordId)
    );
  };

  const handleAddPsychRecord = async () => {
    const newRecord = {
      citizenid: id,
      diagnosis: "Neue Diagnose",
      treatment: "Behandlung hier",
      created_by: "Du",
    };
    const addedRecord = await sendNuiMessage(
      "createPsychologicalRecord",
      newRecord
    );
    setPsychologicalRecords([...psychologicalRecords, addedRecord]);
  };

  const handleDeletePsychRecord = async (recordId) => {
    await sendNuiMessage("deletePsychologicalRecord", { recordId });
    setPsychologicalRecords(
      psychologicalRecords.filter((record) => record.id !== recordId)
    );
  };

  // Funktion zum Öffnen des Edit-Modals für medizinische Aufzeichnungen
  const openEditMedicalModal = (record) => {
    setEditMedicalRecord(record);
    setIsEditMedicalModalOpen(true);
  };

  // Funktion zum Öffnen des Edit-Modals für psychologische Aufzeichnungen
  const openEditPsychModal = (record) => {
    setEditPsychRecord(record);
    setIsEditPsychModalOpen(true);
  };

  const handleEditMedicalRecord = async () => {
    await sendNuiMessage("updateMedicalRecord", { ...editMedicalRecord });
    setMedicalRecords(
      medicalRecords.map((rec) =>
        rec.id === editMedicalRecord.id ? editMedicalRecord : rec
      )
    );
    setIsEditMedicalModalOpen(false);
  };

  const handleEditPsychRecord = async () => {
    await sendNuiMessage("updatePsychologicalRecord", { ...editPsychRecord });
    setPsychologicalRecords(
      psychologicalRecords.map((rec) =>
        rec.id === editPsychRecord.id ? editPsychRecord : rec
      )
    );
    setIsEditPsychModalOpen(false);
  };

  const handleSaveContactDetails = async () => {
    const savedDetails = await sendNuiMessage("saveContactDetails", {
      citizenid: id,
      ...editedContactDetails,
    });
    setContactDetails(savedDetails);
    setIsModalOpen(false);
  };

  const handleSaveMedicalRecord = async () => {
    if (
      !newMedicalRecord.diagnosis.trim() ||
      !newMedicalRecord.treatment.trim()
    )
      return;

    const record = {
      citizenid: id,
      diagnosis: newMedicalRecord.diagnosis,
      treatment: newMedicalRecord.treatment,
      created_by: "Du",
    };

    const addedRecord = await sendNuiMessage("createMedicalRecord", record);
    setMedicalRecords([...medicalRecords, addedRecord]);
    setNewMedicalRecord({ diagnosis: "", treatment: "", timestamp: "" });
    setIsMedicalModalOpen(false);
  };

  const handleSavePsychRecord = async () => {
    if (!newPsychRecord.diagnosis.trim() || !newPsychRecord.treatment.trim())
      return;

    const record = {
      citizenid: id,
      diagnosis: newPsychRecord.diagnosis,
      treatment: newPsychRecord.treatment,
      created_by: "Du",
    };

    const addedRecord = await sendNuiMessage(
      "createPsychologicalRecord",
      record
    );
    setPsychologicalRecords([...psychologicalRecords, addedRecord]);
    setNewPsychRecord({ diagnosis: "", treatment: "", timestamp: "" });
    setIsPsychModalOpen(false);
  };

  if (loading) {
    return <div className="loading">Lade Patientendetails...</div>;
  }

  return (
    <div className="patient-details-container">
      <header>
        <h1>Patientendetails: {medicalInformation.name || "Unbekannt"}</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>
          🔙 Zurück
        </button>
      </header>

      <div className="info-grid">
        <div className="card">
          <h2>👤 Persönliche Informationen</h2>
          <p>
            <strong>Name:</strong> {medicalInformation.name}
          </p>
          <p>
            <strong>Geburtsdatum:</strong> {medicalInformation.dob}
          </p>
          <p>
            <strong>Geschlecht:</strong> {medicalInformation.gender}
          </p>
          <p>
            <strong>Größe:</strong> {medicalInformation.height} cm
          </p>
        </div>
        <div className="card">
          <h2>
            📞 Kontaktdaten <span onClick={() => setIsModalOpen(true)}>🖊️</span>
          </h2>
          <p>
            <strong>Telefon:</strong>{" "}
            {contactDetails.phone || "Nicht angegeben"}
          </p>
          <p>
            <strong>Discord:</strong>{" "}
            {contactDetails.discord || "Nicht angegeben"}
          </p>
          <p>
            <strong>Email:</strong> {contactDetails.email || "Nicht angegeben"}
          </p>
        </div>
      </div>

      <section className="notes">
        <h2>📝 Medizinische Notizen</h2>
        {medicalNotes.map((note) => (
          <div key={note.id} className="note">
            <p>{note.note}</p>
            <p>
              <strong>Erstellt von:</strong> {note.created_by}
            </p>
            <button onClick={() => handleDeleteNote(note.id)}>
              ❌ Löschen
            </button>
          </div>
        ))}
        <textarea
          placeholder="Neue Notiz..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button onClick={handleAddNote}>➕ Notiz hinzufügen</button>
      </section>

      <div className="tab-container">
        <button className="tab" onClick={() => setIsMedicalModalOpen(true)}>
          ➕ Medizinische Aufzeichnung
        </button>
        <button className="tab" onClick={() => setIsPsychModalOpen(true)}>
          ➕ Psychologische Aufzeichnung
        </button>
      </div>

      <section>
        <h2>🩺 Medizinische Aufzeichnungen</h2>
        {medicalRecords.map((record) => (
          <div key={record.id} className="record">
            <p>
              <strong>Datum:</strong> {record.timestamp}
            </p>
            <p>
              <strong>Diagnose:</strong> {record.diagnosis}
            </p>
            <p>
              <strong>Behandlung:</strong> {record.treatment}
            </p>
            <p>
              <strong>Erstellt von:</strong> {record.created_by}
            </p>
            <button onClick={() => openEditMedicalModal(record)}>
              🖊️ Bearbeiten
            </button>
            <button onClick={() => handleDeleteMedicalRecord(record.id)}>
              ❌ Löschen
            </button>
          </div>
        ))}
      </section>

      <section>
        <h2>🧠 Psychologische Aufzeichnungen</h2>
        {psychologicalRecords.map((record) => (
          <div key={record.id} className="record">
            <p>
              <strong>Datum:</strong> {record.timestamp}
            </p>
            <p>
              <strong>Diagnose:</strong> {record.diagnosis}
            </p>
            <p>
              <strong>Behandlung:</strong> {record.treatment}
            </p>
            <p>
              <strong>Erstellt von:</strong> {record.created_by}
            </p>
            <button onClick={() => openEditPsychModal(record)}>
              🖊️ Bearbeiten
            </button>
            <button onClick={() => handleDeletePsychRecord(record.id)}>
              ❌ Löschen
            </button>
          </div>
        ))}
      </section>

      <Modal
        isOpen={isMedicalModalOpen}
        title="🩺 Neue Medizinische Aufzeichnung"
        onSave={handleSaveMedicalRecord}
        onClose={() => setIsMedicalModalOpen(false)}
      >
        <input
          type="text"
          placeholder="Diagnose"
          value={newMedicalRecord.diagnosis}
          onChange={(e) =>
            setNewMedicalRecord({
              ...newMedicalRecord,
              diagnosis: e.target.value,
            })
          }
        />
        <textarea
          placeholder="Behandlung"
          value={newMedicalRecord.treatment}
          onChange={(e) =>
            setNewMedicalRecord({
              ...newMedicalRecord,
              treatment: e.target.value,
            })
          }
        ></textarea>
      </Modal>

      <Modal
        isOpen={isPsychModalOpen}
        title="🧠 Neue Psychologische Aufzeichnung"
        onSave={handleSavePsychRecord}
        onClose={() => setIsPsychModalOpen(false)}
      >
        <input
          type="text"
          placeholder="Diagnose"
          value={newPsychRecord.diagnosis}
          onChange={(e) =>
            setNewPsychRecord({ ...newPsychRecord, diagnosis: e.target.value })
          }
        />
        <textarea
          placeholder="Behandlung"
          value={newPsychRecord.treatment}
          onChange={(e) =>
            setNewPsychRecord({ ...newPsychRecord, treatment: e.target.value })
          }
        ></textarea>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        title="📞 Bearbeite Kontaktdaten"
        onSave={handleSaveContactDetails}
        onClose={() => setIsModalOpen(false)}
      >
        <input
          type="text"
          placeholder="Telefon"
          value={editedContactDetails.phone || contactDetails.phone || ""}
          onChange={(e) =>
            setEditedContactDetails({
              ...editedContactDetails,
              phone: e.target.value,
            })
          }
        />
        <input
          type="text"
          placeholder="Discord"
          value={editedContactDetails.discord || contactDetails.discord || ""}
          onChange={(e) =>
            setEditedContactDetails({
              ...editedContactDetails,
              discord: e.target.value,
            })
          }
        />
        <input
          type="text"
          placeholder="Email"
          value={editedContactDetails.email || contactDetails.email || ""}
          onChange={(e) =>
            setEditedContactDetails({
              ...editedContactDetails,
              email: e.target.value,
            })
          }
        />
      </Modal>

      <Modal
        isOpen={isEditMedicalModalOpen}
        title="✏️ Medizinische Aufzeichnung bearbeiten"
        onSave={handleEditMedicalRecord}
        onClose={() => setIsEditMedicalModalOpen(false)}
      >
        <input
          type="text"
          value={editMedicalRecord?.diagnosis || ""}
          onChange={(e) =>
            setEditMedicalRecord({
              ...editMedicalRecord,
              diagnosis: e.target.value,
            })
          }
        />
        <textarea
          value={editMedicalRecord?.treatment || ""}
          onChange={(e) =>
            setEditMedicalRecord({
              ...editMedicalRecord,
              treatment: e.target.value,
            })
          }
        ></textarea>
      </Modal>

      <Modal
        isOpen={isEditPsychModalOpen}
        title="✏️ Psychologische Aufzeichnung bearbeiten"
        onSave={handleEditPsychRecord}
        onClose={() => setIsEditPsychModalOpen(false)}
      >
        <input
          type="text"
          value={editPsychRecord?.diagnosis || ""}
          onChange={(e) =>
            setEditPsychRecord({
              ...editPsychRecord,
              diagnosis: e.target.value,
            })
          }
        />
        <textarea
          value={editPsychRecord?.treatment || ""}
          onChange={(e) =>
            setEditPsychRecord({
              ...editPsychRecord,
              treatment: e.target.value,
            })
          }
        ></textarea>
      </Modal>
    </div>
  );
};

export default PatientDetails;
