ESX = exports["es_extended"]:getSharedObject()

-- 📟 Tablet öffnen & Job abrufen
RegisterCommand("tablet", function()
    print("📟 Tablet wird geöffnet")
    TriggerServerEvent("tablet:requestPlayerJob")
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "openTablet"
    })
end, false)

-- 📟 Tablet schließen
RegisterNUICallback("closeTablet", function()
    print("📟 Tablet wird geschlossen")
    SetNuiFocus(false, false)
end)

-- 📌 Spielerjob empfangen
RegisterNetEvent("tablet:receivePlayerJob")
AddEventHandler("tablet:receivePlayerJob", function(job)
    print("📌 Job vom Server erhalten:", job)
    SendNUIMessage({
        action = "updateJob",
        job = job or "unemployed"
    })
end)

RegisterNUICallback("getPlayerJob", function(_, cb)
    local playerData = ESX.GetPlayerData()
    if playerData and playerData.job then
        print("Job gefunden:", playerData.job.name)
        cb({ job = playerData.job.name })
    else
        print("Kein Job gefunden")
        cb({ job = "unemployed" })
    end
end)

-- 📌 Spielername abrufen
RegisterNUICallback("getSpielerName", function(_, cb)
    TriggerServerEvent("netry_tablet:getSpielerName")
    RegisterNetEvent("netry_tablet:sendSpielerName")
    AddEventHandler("netry_tablet:sendSpielerName", function(charName)
        cb({ name = charName })
    end)
end)

-----------------------------------------
-- 🔍 DYNAMISCHE PERSONENSUCHE
-----------------------------------------


RegisterNUICallback("searchPerson", function(data, cb)
    local xPlayer = ESX.GetPlayerData()

    if not xPlayer or not xPlayer.job then
        print("^1[ERROR] Kein Job gefunden für die Personensuche!^0")
        cb("error")
        return
    end

    local job = xPlayer.job.name
    local callback

    if job == "ambulance" then
        callback = "sendSearchResultsEMS"
    elseif job == "police" or job == "doj" then
        callback = "sendSearchResultsPolice"
    elseif job == "fib" then
        callback = "sendSearchResultsFIB"
    else
        print("^1[ERROR] Zugriff verweigert: Keine Berechtigung für die Suche!^0")
        cb("error")
        return
    end

    TriggerServerEvent("netry_tablet:searchPerson", data.query, job)
    cb("ok")
end)

-- 🔍 Event-Handler für verschiedene Fraktionen
RegisterNetEvent("netry_tablet:sendSearchResults")
AddEventHandler("netry_tablet:sendSearchResults", function(results)
    print("^2[INFO] Suchergebnisse empfangen:", json.encode(results))
    SendNUIMessage({ type = "searchResultsEMS", results = results })
end)


RegisterNetEvent("netry_tablet:sendSearchResultsPolice")
AddEventHandler("netry_tablet:sendSearchResultsPolice", function(results)
    SendNUIMessage({ type = "searchResultsPolice", results = results })
end)

RegisterNetEvent("netry_tablet:sendSearchResultsFIB")
AddEventHandler("netry_tablet:sendSearchResultsFIB", function(results)
    SendNUIMessage({ type = "searchResultsFIB", results = results })
end)

RegisterNUICallback("searchPatients", function(data, cb)
    TriggerServerEvent("netry_tablet:searchPatients", data.query)
    cb("ok")
end)

-----------------------------------------


local jobData = nil
local employees = {}

RegisterNUICallback("getPlayerJobEmployeeList", function(_, cb)
    lib.callback("netry_Tablet:getPlayerJobEmployeeList", false, function(data)
        if data then
            jobData = data
            cb({ action = "getPlayerJobResponse", status = "success", data = data })
        else
            cb({ action = "getPlayerJobResponse", status = "error", message = "Kein Job gefunden" })
        end
    end)
end)

RegisterNUICallback("getEmployees", function(data, cb)
    if not data.job then
        cb({ action = "getEmployeesResponse", status = "error", message = "Kein Job übermittelt" })
        return
    end

    lib.callback("netry_Tablet:getEmployees", false, function(employeeList)
        if employeeList then
            employees = employeeList
            cb({ action = "getEmployeesResponse", status = "success", data = employeeList })
        else
            cb({ action = "getEmployeesResponse", status = "error", message = "Keine Mitarbeiter gefunden" })
        end
    end, data.job)
end)
