export function useFivemApi() {
  const getAvailableFactions = async (setFactions) => {
    try {
      const response = await fetch(`https://netry_tablet/getAvailableFactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      setFactions(result || []);
    } catch (error) {
      console.error("Fehler beim Abrufen der Fraktionen:", error);
    }
  };

  const getYamlSettings = async (faction, setYamlContent) => {
    try {
      const response = await fetch(`https://netry_tablet/getFactionYaml`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faction }),
      });

      const result = await response.text();
      setYamlContent(result || "");
    } catch (error) {
      console.error(`Fehler beim Laden der YAML-Daten für ${faction}:`, error);
    }
  };

  const saveYamlSettings = async (faction, yamlContent, callback) => {
    try {
      await fetch(`https://netry_tablet/saveFactionYaml`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faction, yamlContent }),
      });

      callback(true);
    } catch (error) {
      console.error(`Fehler beim Speichern der YAML-Daten für ${faction}:`, error);
      callback(false);
    }
  };

  return { getAvailableFactions, getYamlSettings, saveYamlSettings };
}
