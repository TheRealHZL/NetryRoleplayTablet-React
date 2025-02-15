ESX = exports["es_extended"]:getSharedObject()

RegisterCommand("tablet", function()
    SetNuiFocus(true, true) -- Maussteuerung aktivieren
    SendNUIMessage({ action = "openTablet" }) -- Tablet öffnen
end, false)

RegisterNUICallback("closeTablet", function()
    SetNuiFocus(false, false) -- Maussteuerung deaktivieren
end)

RegisterNUICallback("getPlayerJob", function(_, cb)
    local playerData = ESX.GetPlayerData()
    if playerData and playerData.job then
        cb({ job = playerData.job.name }) -- Sendet den Job zurück
    else
        cb({ job = "unemployed" }) -- Falls kein Job gefunden wird
    end
end)
