export async function getSpielerName() {
    try {
      const response = await fetch(`https://${GetParentResourceName()}/getSpielerName`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
      return data.name || "Unbekannter Spieler";
    } catch (error) {
      console.error("Fehler beim Abrufen des Spielernamens:", error);
      return "Fehler beim Laden";
    }
  }

  export async function sendNuiMessage(event, data = {}) {
    return fetch(`https://netry_tablet/${event}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    .then(res => res.json())
    .catch(err => console.error("NUI Fetch Error:", err));
}

// NUI Listener für Suchergebnisse
window.addEventListener("message", (event) => {
    if (event.data.type === "searchResults") {
        window.dispatchEvent(new CustomEvent("searchResultsReceived", { detail: event.data.results }));
    }

    if (event.data.type === "personDetails") {
        window.dispatchEvent(new CustomEvent("personDetailsReceived", { detail: event.data.details }));
    }
});
