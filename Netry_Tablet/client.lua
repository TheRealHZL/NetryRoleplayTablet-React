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


local function fetchServerData(eventName, data, cb)
    ESX.TriggerServerCallback(eventName, cb, data)
end

-- Event-Listener für NUI Nachrichten (JSX-Frontend)
RegisterNUICallback("getMedicalInformation", function(data, cb)
    ESX.TriggerServerCallback("getMedicalInformation", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)

-- NUI Callback für medizinische Akten
RegisterNUICallback("getMedicalRecords", function(data, cb)
    ESX.TriggerServerCallback("getMedicalRecords", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)

-- NUI Callback für medizinische Notizen
RegisterNUICallback("getMedicalNotes", function(data, cb)
    ESX.TriggerServerCallback("getMedicalNotes", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)

-- NUI Callback für psychologische Akten
RegisterNUICallback("getPsychologicalRecords", function(data, cb)
    ESX.TriggerServerCallback("getPsychologicalRecords", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)

-- NUI Callback für Kontaktinformationen
RegisterNUICallback("getContactDetails", function(data, cb)
    ESX.TriggerServerCallback("getContactDetails", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)

-- Notiz hinzufügen
RegisterNUICallback("addMedicalNote", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:addMedicalNote", function(success)
        cb(success)
    end, { citizenid = data.citizenid, note = data.note })
end)

-- Notiz löschen
RegisterNUICallback("deleteMedicalNote", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:deleteMedicalNote", function(success)
        cb(success)
    end, { noteId = data.noteId })
end)

-- Medizinische Akte hinzufügen
RegisterNUICallback("createMedicalRecord", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:createMedicalRecord", function(success)
        cb(success)
    end, {
        citizenid = data.citizenid,
        title = data.title,
        description = data.description,
        created_by = GetPlayerName(PlayerId())
    })
end)

-- Medizinische Akte löschen
RegisterNUICallback("deleteMedicalRecord", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:deleteMedicalRecord", function(success)
        cb(success)
    end, { recordId = data.recordId })
end)

-- Psychologische Akte hinzufügen
RegisterNUICallback("createPsychologicalRecord", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:createPsychologicalRecord", function(success)
        cb(success)
    end, {
        citizenid = data.citizenid,
        diagnosis = data.diagnosis,
        treatment = data.treatment,
        created_by = GetPlayerName(PlayerId())
    })
end)

-- Psychologische Akte löschen
RegisterNUICallback("deletePsychologicalRecord", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:deletePsychologicalRecord", function(success)
        cb(success)
    end, { recordId = data.recordId })
end)

-- Kontaktinformationen speichern
RegisterNUICallback("saveContactDetails", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:updateContactInformation", function(success)
        cb(success)
    end, {
        citizenid = data.citizenid,
        phone = data.phone,
        discord = data.discord,
        email = data.email
    })
end)


