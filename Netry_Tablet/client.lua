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
RegisterNetEvent("netry_tablet:sendSearchResultsEMS")
AddEventHandler("netry_tablet:sendSearchResultsEMS", function(results)
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

-----------------------------------------
-- 🚔 POLIZEI- UND JUSTIZAKTEN (PD, DOJ)
-----------------------------------------
RegisterNUICallback("getPoliceRecords", function(data, cb)
    TriggerServerEvent("netry_tablet:getPoliceRecords", data.citizenid)
    cb("ok")
end)

RegisterNUICallback("createPoliceRecord", function(data, cb)
    TriggerServerEvent("netry_tablet:createPoliceRecord", data)
    cb("ok")
end)

RegisterNetEvent("netry_tablet:sendPoliceRecords")
AddEventHandler("netry_tablet:sendPoliceRecords", function(records)
    SendNUIMessage({ type = "policeRecords", records = records })
end)

-----------------------------------------
-- 🚑 MEDIZINISCHE AKTEN (EMS)
-----------------------------------------
RegisterNUICallback("getMedicalRecords", function(data, cb)
    TriggerServerEvent("netry_tablet:getMedicalRecords", data.citizenid)
    cb("ok")
end)

RegisterNUICallback("createMedicalRecord", function(data, cb)
    TriggerServerEvent("netry_tablet:createMedicalRecord", data)
    cb("ok")
end)

RegisterNetEvent("netry_tablet:sendMedicalRecords")
AddEventHandler("netry_tablet:sendMedicalRecords", function(records)
    SendNUIMessage({ type = "medicalRecords", records = records })
end)

-----------------------------------------
-- 📝 MEDIZINISCHE NOTIZEN (EMS)
-----------------------------------------
RegisterNUICallback("getMedicalNotes", function(data, cb)
    TriggerServerEvent("netry_tablet:getMedicalNotes", data.citizenid)
    cb("ok")
end)

RegisterNUICallback("addMedicalNote", function(data, cb)
    TriggerServerEvent("netry_tablet:addMedicalNote", data)
    cb("ok")
end)

RegisterNetEvent("netry_tablet:sendMedicalNotes")
AddEventHandler("netry_tablet:sendMedicalNotes", function(notes)
    SendNUIMessage({ type = "medicalNotes", records = notes })
end)

-----------------------------------------
-- 💊 MEDIZINISCHE INFORMATIONEN (EMS)
-----------------------------------------
RegisterNUICallback("getMedicalInformation", function(data, cb)
    TriggerServerEvent("netry_tablet:getMedicalInformation", data.citizenid)
    cb("ok")
end)

RegisterNUICallback("saveMedicalInformation", function(data, cb)
    TriggerServerEvent("netry_tablet:saveMedicalInformation", data)
    cb("ok")
end)

RegisterNetEvent("netry_tablet:sendMedicalInformation")
AddEventHandler("netry_tablet:sendMedicalInformation", function(info)
    SendNUIMessage({ type = "medicalInformation", records = info })
end)

-----------------------------------------
-- 🧠 PSYCHOLOGISCHE AKTEN (EMS)
-----------------------------------------
RegisterNUICallback("getPsychologicalRecords", function(data, cb)
    TriggerServerEvent("netry_tablet:getPsychologicalRecords", data.citizenid)
    cb("ok")
end)

RegisterNUICallback("createPsychologicalRecord", function(data, cb)
    TriggerServerEvent("netry_tablet:createPsychologicalRecord", data)
    cb("ok")
end)

RegisterNetEvent("netry_tablet:sendPsychologicalRecords")
AddEventHandler("netry_tablet:sendPsychologicalRecords", function(records)
    SendNUIMessage({ type = "psychologicalRecords", records = records })
end)