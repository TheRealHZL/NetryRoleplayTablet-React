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


RegisterNUICallback("searchPatients", function(data, cb)
    TriggerServerEvent("netry_tablet:searchPatients", data.query)
    cb("ok")
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

--------------------------------
--- Police Stuff ---
--------------------------------

-- Police Searche
RegisterNetEvent("netry_tablet:sendSearchResults")
AddEventHandler("netry_tablet:sendSearchResults", function(results)
    print("^2[INFO] Suchergebnisse empfangen:", json.encode(results))
    SendNUIMessage({ type = "searchResultsPolice", results = results })
end)


-- Police Records

RegisterNUICallback("getPoliceRecords", function(data, cb)
    ESX.TriggerServerCallback("getPoliceRecords", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)

-- Police Notes

RegisterNUICallback("getPoliceNotes", function(data, cb)
    ESX.TriggerServerCallback("getPoliceNotes", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)

-- Police Notes Edit

RegisterNUICallback("editPoliceNote", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:editPoliceNote", function(success)
        cb(success)
    end, { noteId = data.noteId, note = data.note })
end)

-- Police Notes Delete

RegisterNUICallback("deletePoliceNote", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:deletePoliceNote", function(success)
        cb(success)
    end, { noteId = data.noteId })
end)

-- Police Contact Details

RegisterNUICallback("getPoliceContactDetails", function(data, cb)
    ESX.TriggerServerCallback("getPoliceContactDetails", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)

-- Policce Contact Details Save 

RegisterNUICallback("savePoliceContactDetails", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:updatePoliceContactDetails", function(success)
        cb(success)
    end, {
        citizenid = data.citizenid,
        phone = data.phone,
        discord = data.discord,
        email = data.email
    })
end)

-- Police Record Create

RegisterNUICallback("createPoliceRecord", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:createPoliceRecord", function(success)
        cb(success)
    end, {
        citizenid = data.citizenid,
        title = data.title,
        description = data.description,
        created_by = GetPlayerName(PlayerId())
    })
end)

-- Police Record Edit

RegisterNUICallback("editPoliceRecord", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:editPoliceRecord", function(success)
        cb(success)
    end, { recordId = data.recordId, title = data.title, description = data.description })
end)

-- Police Record Delete

RegisterNUICallback("deletePoliceRecord", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:deletePoliceRecord", function(success)
        cb(success)
    end, { recordId = data.recordId })
end)


-- Police Justice Records Create

RegisterNUICallback("createJusticeRecord", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:createJusticeRecord", function(success)
        cb(success)
    end, {
        citizenid = data.citizenid,
        title = data.title,
        description = data.description,
        created_by = GetPlayerName(PlayerId())
    })
end)

-- Police Justice Record Edit

RegisterNUICallback("editJusticeRecord", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:editJusticeRecord", function(success)
        cb(success)
    end, { recordId = data.recordId, title = data.title, description = data.description })
end)

-- Police Justice Record Delete

RegisterNUICallback("deleteJusticeRecord", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:deleteJusticeRecord", function(success)
        cb(success)
    end, { recordId = data.recordId })
end)



--------------------------------
--- Justice Stuff ---
--------------------------------

-- Justice Searche
RegisterNetEvent("netry_tablet:sendSearchResultsJustice")
AddEventHandler("netry_tablet:sendSearchResultsJustice", function(results)
    print("^2[INFO] Suchergebnisse empfangen:", json.encode(results))
    SendNUIMessage({ type = "searchResultsJustice", results = results })
end)

-- Justice Records

RegisterNUICallback("getJusticeRecords", function(data, cb)
    ESX.TriggerServerCallback("getJusticeRecords", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)

-- Justice Notes

RegisterNUICallback("getJusticeNotes", function(data, cb)
    ESX.TriggerServerCallback("getJusticeNotes", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)

-- Justice Notes Create

RegisterNUICallback("createJusticeNote", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:createJusticeNote", function(success)
        cb(success)
    end, {
        citizenid = data.citizenid,
        note = data.note,
        created_by = GetPlayerName(PlayerId())
    })
end)

-- Justice Notes Edit

RegisterNUICallback("editJusticeNote", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:editJusticeNote", function(success)
        cb(success)
    end, { noteId = data.noteId, note = data.note })
end)

-- Justice Notes Delete

RegisterNUICallback("deleteJusticeNote", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:deleteJusticeNote", function(success)
        cb(success)
    end, { noteId = data.noteId })
end)

-- Justice Contact Details

RegisterNUICallback("getJusticeContactDetails", function(data, cb)
    ESX.TriggerServerCallback("getJusticeContactDetails", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)


--------------------------------
--- Mechanic Stuff ---
--------------------------------

-- Mechanic Searche
RegisterNetEvent("netry_tablet:sendSearchResultsMechanic")
AddEventHandler("netry_tablet:sendSearchResultsMechanic", function(results)
    print("^2[INFO] Suchergebnisse empfangen:", json.encode(results))
    SendNUIMessage({ type = "searchResultsMechanic", results = results })
end)

-- Mechanic Records

RegisterNUICallback("getMechanicRecords", function(data, cb)
    ESX.TriggerServerCallback("getMechanicRecords", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)

-- Mechanic Notes

RegisterNUICallback("getMechanicNotes", function(data, cb)
    ESX.TriggerServerCallback("getMechanicNotes", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)

-- Mechanic Notes Create

RegisterNUICallback("createMechanicNote", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:createMechanicNote", function(success)
        cb(success)
    end, {
        citizenid = data.citizenid,
        title = data.title,
        description = data.description,
        created_by = GetPlayerName(PlayerId())
    })
end)

-- Mechanic Notes Edit

RegisterNUICallback("editMechanicNote", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:editMechanicNote", function(success)
        cb(success)
    end, { noteId = data.noteId, title = data.title, description = data.description })
end)

-- Mechanic Notes Delete

RegisterNUICallback("deleteMechanicNote", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:deleteMechanicNote", function(success)
        cb(success)
    end, { noteId = data.noteId })
end)

-- Mechanic Contact Details

RegisterNUICallback("getMechanicContactDetails", function(data, cb)
    ESX.TriggerServerCallback("getMechanicContactDetails", function(result)
        cb(result or {})
    end, { citizenid = data.citizenid })
end)

-- Mechanic Record Create

RegisterNUICallback("createMechanicRecord", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:createMechanicRecord", function(success)
        cb(success)
    end, {
        citizenid = data.citizenid,
        title = data.title,
        description = data.description,
        created_by = GetPlayerName(PlayerId())
    })
end)

-- Mechanic Record Edit

RegisterNUICallback("editMechanicRecord", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:editMechanicRecord", function(success)
        cb(success)
    end, { recordId = data.recordId, title = data.title, description = data.description })
end)

-- Mechanic Record Delete

RegisterNUICallback("deleteMechanicRecord", function(data, cb)
    ESX.TriggerServerCallback("netry_tablet:deleteMechanicRecord", function(success)
        cb(success)
    end, { recordId = data.recordId })
end)

