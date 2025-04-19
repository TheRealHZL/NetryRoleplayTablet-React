import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faUsers,
  faSearch,
  faFlask,
  faCar,
  faMapMarkerAlt,
  faAmbulance,
  faBook,
  faGraduationCap,
  faUserTie,
  faList,
  faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ job }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Verbesserte Icon-Zuordnung
  const getIcon = (name) => {
    switch (name) {
      case "Dashboard": return faChartBar;
      case "Leitstelle": return faUsers;
      case "Personensuche": return faSearch;
      case "Patientenakten": return faAmbulance;
      case "Fahrzeugsuche": return faCar;
      case "Listen": return faList;
      case "Berichtswesen": return faFileAlt;
      case "Mitarbeiter": return faUserTie;
      case "Bewerbung": return faFileAlt;
      case "Wissensdatenbank": return faBook;
      case "Knowledgebase": return faBook;
      case "Training": return faGraduationCap;
      default: return faChartBar;
    }
  };

  // Berufsspezifische Farbklassen und Icons
  const getJobClass = () => {
    switch (job) {
      case "police": return "job-police";
      case "ambulance": return "job-ambulance";
      case "mechanic": return "job-mechanic";
      case "fire": return "job-fire";
      case "fsa": return "job-admin";
      default: return "";
    }
  };

  const getJobIcon = () => {
    switch (job) {
      case "police": return faUsers;
      case "ambulance": return faAmbulance;
      case "mechanic": return faCar;
      case "fire": return faAmbulance;
      case "fsa": return faChartBar;
      default: return faChartBar;
    }
  };

  const getJobName = () => {
    switch (job) {
      case "police": return "Polizei";
      case "ambulance": return "Rettungsdienst";
      case "mechanic": return "Mechaniker";
      case "fire": return "Feuerwehr";
      case "fsa": return "Admin";
      default: return "Tablet";
    }
  };

  // Menüpunkte für jede Berufsgruppe (unverändert)
  const menuItems = {
    police: [
      { name: "Dashboard", icon: faChartBar, route: "/police/dashboard" },
      { name: "Leitstelle", icon: faUsers, route: "/police/leitstelle" },
      { name: "Personensuche", icon: faSearch, route: "/police/search" },
      { name: "Fahrzeugsuche", icon: faFlask, route: "/police/vehicle" },
      { name: "Listen", icon: faCar, route: "/module/globallistmodule" },
      { name: "Berichtswesen", icon: faMapMarkerAlt, route: "/police/ReportManagement" },
      { name: "Mitarbeiter", icon: faChartBar, route: "/module/globalemployeelist" },
      { name: "Bewerbung", icon: faUsers, route: "/police/bewerbung" },
    ],
    ambulance: [
      { name: "Dashboard", icon: faChartBar, route: "/ambulance/medicdashboard" },
      { name: "Leitstelle", icon: faCar, route: "/module/dispatchcenter" },
      { name: "Patientenakten", icon: faAmbulance, route: "/ambulance/PatientSearch" },
      { name: "Listen", icon: faCar, route: "/module/globallistmodule" },
      { name: "Wissensdatenbank", icon: faChartBar, route: "/ambulance/knowledgebase" },
      { name: "Training", icon: faChartBar, route: "/ambulance/trainingdashboard" },
      { name: "Mitarbeiter", icon: faChartBar, route: "/module/globalemployeelist" },
    ],
    mechanic: [
      { name: "Dashboard", icon: faChartBar, route: "/mechanic/dashboard" },
      { name: "Listen", icon: faCar, route: "/module/globallistmodule" },
      { name: "Mitarbeiter", icon: faChartBar, route: "/module/globalemployeelist" },
    ],
    fire: [
      { name: "Dashboard", icon: faChartBar, route: "/fire/dashboard" },
      { name: "Leitstelle", icon: faCar, route: "/module/dispatchcenter" },
      { name: "Listen", icon: faCar, route: "/module/globallistmodule" },
      { name: "Mitarbeiter", icon: faChartBar, route: "/module/globalemployeelist" },
    ],
    fsa: [
      { name: "Dashboard", icon: faChartBar, route: "/admin/dashboard" },
      { name: "Yaml Editor", icon: faChartBar, route: "/admin/yamleditor" },
    ],
  };

  // Prüfen, ob ein Menüpunkt aktiv ist
  const isActive = (route) => {
    return location.pathname === route;
  };

  return (
    <div className={`sidebar ${getJobClass()} ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Job-Header mit Collapse-Button */}
      <div className="job-header">
        <div className="job-icon">
          <FontAwesomeIcon icon={getJobIcon()} />
        </div>
        {!isCollapsed && <div className="job-name">{getJobName()}</div>}
        <button 
          className="toggle-sidebar" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <FontAwesomeIcon icon={isCollapsed ? 'chevron-right' : 'chevron-left'} />
        </button>
      </div>

      {/* Menü */}
      <nav className="menu">
        <ul>
          {menuItems[job]?.map((item, index) => (
            <li key={index}>
              <Link 
                to={item.route} 
                className={`menu-item ${isActive(item.route) ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={getIcon(item.name)} className="icon" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer mit Version */}
      <div className="sidebar-footer">
        {!isCollapsed && <span>v2.0.0</span>}
      </div>
    </div>
  );
};

export default Sidebar;