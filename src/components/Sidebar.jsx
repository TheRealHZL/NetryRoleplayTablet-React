import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faUsers,
  faSearch,
  faFlask,
  faCar,
  faMapMarkerAlt,
  faAmbulance,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = ({ job }) => {
  const menuItems = {
    police: [
      { name: "Dashboard", icon: faChartBar, route: "/police/dashboard" },
      { name: "Leitstelle", icon: faUsers, route: "/police/leitstelle" },
      { name: "Personensuche", icon: faSearch, route: "/police/search" },
      { name: "Fahrzeugsuche", icon: faFlask, route: "/police/vehicle" },
      { name: "Berichtswesen", icon: faMapMarkerAlt, route: "/police/ReportManagement" },
      { name: "Listen", icon: faCar, route: "/police/listen" },
      { name: "Statistiken", icon: faChartBar, route: "/police/statistics" },
      { name: "Bewerbung", icon: faUsers, route: "/police/bewerbung" },
    ],
    ambulance: [
      { name: "Dashboard", icon: faChartBar, route: "/ambulance/medicdashboard" },
      { name: "Patientenakten", icon: faAmbulance, route: "/ambulance/patientserch" },
      { name: "Listen", icon: faCar, route: "/ambulance/Listen" },
      { name: "Knowledgebase", icon: faChartBar, route: "/ambulance/knowledgebase" },
      { name: "Training", icon: faChartBar, route: "/ambulance/trainingdashboard" },
      { name: "Mitarbeiter", icon: faChartBar, route: "/ambulance/employee-management" },
    ],
    mechanic: [
      { name: "Dashboard", icon: faChartBar, route: "/mechanic/dashboard" },
      { name: "Aufträge", icon: faCar, route: "/mechanic/orders" },
    ],
    fsa: [
      { name: "Dashboard", icon: faChartBar, route: "/admin/dashboard" },
      { name: "Logs", icon: faFlask, route: "/admin/logs" },
    ],
  };

  return (
    <div className="sidebar">
      <nav className="menu">
        <ul>
          {menuItems[job]?.map((item, index) => (
            <li key={index}>
              <Link to={item.route} className="menu-item">
                <FontAwesomeIcon icon={item.icon} className="icon" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
