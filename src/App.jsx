import { HashRouter as Router } from "react-router-dom";
import Tablet from "./components/Tablet";

function App() {
    return (
        <Router>
            <Tablet /> {/* Das Tablet ist jetzt die Hauptkomponente */}
        </Router>
    );
}

export default App;
