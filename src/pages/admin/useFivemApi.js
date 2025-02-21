export function useFivemApi() {
    const getYamlSettings = async (faction, callback) => {
      window.invokeNative("adminYaml:getYamlSettings", faction);
      window.addEventListener("message", (event) => {
        if (event.data?.type === "adminYaml:receiveYamlSettings") {
          callback(event.data.settings || "");
        }
      });
    };
  
    const saveYamlSettings = async (faction, settings, callback) => {
      window.invokeNative("adminYaml:saveYamlSettings", faction, settings);
      window.addEventListener("message", (event) => {
        if (event.data?.type === "adminYaml:saveSuccess") {
          callback(event.data.success);
        }
      });
    };
  
    return { getYamlSettings, saveYamlSettings };
  }
  