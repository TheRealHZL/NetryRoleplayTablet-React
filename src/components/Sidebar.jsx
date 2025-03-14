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
      { name: "Knowledgebase", icon: faChartBar, route: "/ambulance/knowledgebase" },
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
