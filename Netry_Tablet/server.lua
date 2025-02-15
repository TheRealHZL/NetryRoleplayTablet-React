ESX = exports["es_extended"]:getSharedObject()

RegisterNUICallback("getPlayerJob", function(data, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    if xPlayer then
        cb({ job = xPlayer.getJob().name }) -- Sendet den Job zurück
    else
        cb({ job = "unemployed" }) -- Falls kein Job gefunden wird
    end
end)
