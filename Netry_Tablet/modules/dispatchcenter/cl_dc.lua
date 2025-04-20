local ESX = exports["es_extended"]:getSharedObject()

RegisterNUICallback("getEMSStaff", function(_, cb)
    lib.callback("dispatch:getEMSStaff", false, function(staff)
        cb(staff)
    end)
end)

RegisterNUICallback("updateEMSStaff", function(data, cb)
    lib.callback("dispatch:updateEMSStaff", false, function(success)
        cb(success and "success" or "error")
    end, data)
end)

RegisterNUICallback("addEMSStaff", function(data, cb)
    lib.callback("dispatch:addEMSStaff", false, function(success)
        cb(success and "success" or "error")
    end, data)
end)

RegisterNUICallback("removeEMSStaff", function(data, cb)
    lib.callback("dispatch:removeEMSStaff", false, function(success)
        cb(success and "success" or "error")
    end, data)
end)

RegisterNUICallback("getSpielerName", function(_, cb)
    local playerData = ESX.GetPlayerData()
    local name = "Unbekannt"

    if playerData and playerData.charinfo then
        name = playerData.charinfo.firstname .. " " .. playerData.charinfo.lastname
    elseif playerData and playerData.firstName then
        name = playerData.firstName .. " " .. playerData.lastName
    end

    cb(name) -- Sendet den Namen an die NUI
end)