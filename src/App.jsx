import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
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
/* Mechaniker Stuff */
import MechanicDashboard from "./pages/mechanic/Dashboard";
/* Admin Stuff */
import AdminDashboard from "./pages/admin/Dashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar job="ambulance" /> {/* Sidebar bleibt unabhängig von der Fraktion */}
        <div className="main-content">
          <Routes>
              /* Police Stuff */
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
            /* Ambulance Stuff */
            <Route path="/ambulance/medicdashboard" element={<AmbulanceDashboard />} />
            <Route path="/ambulance/patientserch" element={<PatientSearch />} />
            <Route path="/ambulance/patientdetails/:id" element={<PatientDetails />} />
            /* Mechaniker Stuff */
            <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
            /* Admin Stuff */
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
