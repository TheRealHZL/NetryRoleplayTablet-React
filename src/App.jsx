import { HashRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Tablet from "./components/Tablet";
/* Police Stuff */
import PoliceDashboard from "./pages/police/Dashboard";
import Leitstelle from "./pages/police/Leitstelle";
import PersonSearch from "./pages/police/PersonSearch";
import PersonDetails from "./pages/police/PersonDetails";
import VehicleSearch from "./pages/police/VehicleSearch";
import VehicleDetails from "./pages/police/VehicleDetails";
import ReportManagement from "./pages/police/ReportManagement";
import ListModule from "./pages/police/Listen";
import Statistics from "./pages/police/Statistics";
import ApplicationOverview from "./pages/police/ApplicationOverview";
/* Ambulance Stuff */
import AmbulanceDashboard from "./pages/ambulance/MedicDashboard";
import PatientSearch from "./pages/ambulance/PatientSearch";
import PatientDetails from "./pages/ambulance/PatientDetails";
import KnowledgeBase from "./pages/ambulance/KnowledgeBase";
import TrainingDashboard from "./pages/ambulance/TrainingDashboard";
import EmployeeManagement from "./pages/ambulance/EmployeeManagement";
/* Mechaniker Stuff */
import MechanicDashboard from "./pages/mechanic/Dashboard";
/* Admin Stuff */
import AdminDashboard from "./pages/admin/Dashboard";
import "./App.css";

function App() {
  const [job, setJob] = useState(null);

  useEffect(() => {
    // Job aus FiveM abrufen
    fetch(`https://${GetParentResourceName()}/getPlayerJob`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(data => {
      setJob(data.job); // Speichert den Job des Spielers
    })
    .catch(err => console.error("Fehler beim Abrufen des Jobs:", err));
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Tablet />
        {job ? <Sidebar job={job} /> : <Sidebar job="default" />} {/* Sidebar abhängig vom Job */}
        <div className="main-content">
          <Routes>
              {/* Police Stuff */}
            <Route path="/police/dashboard" element={<PoliceDashboard />} />
            <Route path="/police/leitstelle" element={<Leitstelle />} />
            <Route path="/police/search" element={<PersonSearch />} />
            <Route path="/police/person/:id" element={<PersonDetails />} />
            <Route path="/police/vehicle" element={<VehicleSearch />} />
            <Route path="/police/vehicle-details/:id" element={<VehicleDetails />} />
            <Route path="/police/reportmanagement" element={<ReportManagement />} />
            <Route path="/police/statistics" element={<Statistics />} />
            <Route path="/person-details" element={<PersonDetails />} />
            <Route path="/police/listen" element={<ListModule />} />
            <Route path="/police/bewerbung" element={<ApplicationOverview />} />
            {/* Ambulance Stuff */}
            <Route path="/ambulance/medicdashboard" element={<AmbulanceDashboard />} />
            <Route path="/ambulance/patientserch" element={<PatientSearch />} />
            <Route path="/ambulance/patientdetails/:id" element={<PatientDetails />} />
            <Route path="/ambulance/knowledgebase" element={<KnowledgeBase />} />
            <Route path="/ambulance/trainingdashboard" element={<TrainingDashboard />} />
            <Route path="/ambulance/employee-management" element={<EmployeeManagement />} />
            {/* Mechaniker Stuff */}
            <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
            {/* Admin Stuff */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
