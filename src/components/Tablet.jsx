import { useEffect, useState } from "react";
import "./Tablet.css"; // Falls du Styles brauchst

function Tablet() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.action === "openTablet") {
                setIsVisible(true);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    const closeTablet = () => {
        setIsVisible(false);
        fetch(`https://${GetParentResourceName()}/closeTablet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
    };

    if (!isVisible) return null;

    return (
        <div className="tablet-overlay">
            <button onClick={closeTablet} className="close-btn">Schließen</button>
            <div className="tablet-content">
                <h1>Tablet UI</h1>
                {/* Hier könntest du weitere Inhalte oder Komponenten einfügen */}
            </div>
        </div>
    );
}

export default Tablet;
