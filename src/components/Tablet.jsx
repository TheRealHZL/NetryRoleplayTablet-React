import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./Tablet.css"; 

{/* POLICE */}
import PoliceDashboard from "../pages/police/Dashboard";
import Leitstelle from "../pages/police/Leitstelle";
import PersonSearch from "../pages/police/PersonSearch";
import PersonDetails from "../pages/police/PersonDetails";
import VehicleSearch from "../pages/police/VehicleSearch";
import VehicleDetails from "../pages/police/VehicleDetails";
import ReportManagement from "../pages/police/ReportManagement";
import Statistics from "../pages/police/Statistics";
import ApplicationOverview from "../pages/police/ApplicationOverview";

{/* AMBULANCE */}
import AmbulanceDashboard from "../pages/ambulance/MedicDashboard";
import PatientSearch from "../pages/ambulance/PatientSearch";
import PatientDetails from "../pages/ambulance/PatientDetails";
import KnowledgeBase from "../pages/ambulance/KnowledgeBase";
import TrainingDashboard from "../pages/ambulance/TrainingDashboard";
import EmployeeManagement from "../pages/ambulance/EmployeeManagement";

{/* FIRE */}
import FireDashboard from "../pages/fire/FireDashboard";
import KnowledgeBaseFire from "../pages/fire/KnowledgeBaseFire";

{/* MECHANIC */}
import MechanicDashboard from "../pages/mechanic/Dashboard";
import MechanicEmployees from "../pages/mechanic/MechanicEmployees";

{/* ADMIN */}
import AdminDashboard from "../pages/admin/Dashboard";
import YamlEditor from "../pages/admin/YamlEditor";
import Sidebar from "../components/Sidebar";

{/* Globale Variablen */}
import GlobalListModule from "../pages/module/GlobalListModule";
import EmployeeList from "../pages/module/GlobalEmployeeList";
import DispatchCenter from "../pages/module/DispatchCenter";


function Tablet() {
    const [isVisible, setIsVisible] = useState(false);
    const [job, setJob] = useState(null);

    useEffect(() => {
        const handleMessage = (event) => {
            console.log("📩 NUI Nachricht empfangen:", event.data); // Debugging

            if (event.data.action === "openTablet") {
                console.log("📟 Tablet wird in NUI geöffnet");
                setIsVisible(true);
                document.body.classList.add("tablet-open"); // Sichtbar machen
            } else if (event.data.action === "closeTablet") {
                console.log("📟 Tablet wird in NUI geschlossen");
                setIsVisible(false);
                document.body.classList.remove("tablet-open"); // Unsichtbar machen
            }
        };

        window.addEventListener("message", handleMessage);

        fetch(`https://${GetParentResourceName()}/getPlayerJob`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        })
        .then(res => res.json())
        .then(data => {
            console.log("👮 Spieler-Job:", data.job);
            setJob(data.job);
        })
        .catch(err => console.error("❌ Fehler beim Abrufen des Jobs:", err));

        return () => window.removeEventListener("message", handleMessage);
    }, []);

    const closeTablet = () => {
        console.log("📟 Tablet wird geschlossen");
        setIsVisible(false);
        document.body.classList.remove("tablet-open"); // Unsichtbar machen
        fetch(`https://${GetParentResourceName()}/closeTablet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
    };

    if (!isVisible) return null; // Tablet wird nur gerendert, wenn es sichtbar ist

    return (
        <div className="tablet-overlay">
            <button onClick={closeTablet} className="close-btn">Schließen</button>
            <div className="tablet-container">
                {/* Sidebar abhängig vom Job */}
                {job ? <Sidebar job={job} /> : <Sidebar job="default" />}
                
                {/* Hauptinhalt des Tablets */}
                <div className="tablet-content">
                    <Routes>
                        {/* Police */}
                        <Route path="/police/dashboard" element={<PoliceDashboard />} />
                        <Route path="/police/leitstelle" element={<Leitstelle />} />
                        <Route path="/police/search" element={<PersonSearch />} />
                        <Route path="/police/PersonDetails/:id" element={<PersonDetails />} />
                        <Route path="/police/vehicle" element={<VehicleSearch />} />
                        <Route path="/police/vehicledetails/:id" element={<VehicleDetails />} />
                        <Route path="/police/reportmanagement" element={<ReportManagement />} />
                        <Route path="/police/statistics" element={<Statistics />} />
                        <Route path="/police/bewerbung" element={<ApplicationOverview />} />
                        
                        {/* Ambulance */}
                        <Route path="/ambulance/medicdashboard" element={<AmbulanceDashboard />} />
                        <Route path="/ambulance/patientsearch" element={<PatientSearch />} />
                        <Route path="/ambulance/patientdetails/:id" element={<PatientDetails />} />
                        <Route path="/ambulance/knowledgebase" element={<KnowledgeBase />} />
                        <Route path="/ambulance/trainingdashboard" element={<TrainingDashboard />} />
                        <Route path="/ambulance/employee-management" element={<EmployeeManagement />} />

                        {/* Fire */}
                        <Route path="/fire/fireDashboard" element={<FireDashboard />} />
                        <Route path="/ambulance/patientsearch" element={<PatientSearch />} />
                        <Route path="/ambulance/patientdetails/:id" element={<PatientDetails />} />
                        <Route path="/fire/knowledgebase" element={<KnowledgeBaseFire />} />
                        

                        
                        {/* Mechaniker */}
                        <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
                        <Route path="/mechanic/employee-management" element={<MechanicEmployees />} />

                        {/* Admin */}
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/yamleditor" element={<YamlEditor />} />

                        {/* Default */}
                        <Route path="/module/globallistmodule" element={<GlobalListModule />} />
                        <Route path="/module/globalemployeelist" element={<EmployeeList />} />
                        <Route path="/module/dispatchcenter" element={<DispatchCenter />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Tablet;
