ESX = exports["es_extended"]:getSharedObject()

local yamlSettings = {}

local lib = exports.ox_lib
if not lib then
    print("^1[ERROR] ox_lib nicht geladen! Stelle sicher, dass 'ensure ox_lib' in server.cfg ist.^0")
    return
end

local function debugPrint(msg, data)
    print("^2[DEBUG] " .. msg .. " - " .. json.encode(data))
end

-- Spielername abrufen mit CitizenID
RegisterNetEvent("netry_tablet:getSpielerName")
AddEventHandler("netry_tablet:getSpielerName", function()
    local src = source
    local citizenID = netry.GetCitizenIDFromSource(src) -- CitizenID aus Table abrufen

    if not citizenID then
        print("^1[ERROR] CitizenID für Source " .. src .. " nicht gefunden! Fallback auf SQL-Abfrage...^0")
        local identifier = GetPlayerIdentifier(src, 0) -- Lizenz-Identifikator abrufen
        local result = MySQL.query.await("SELECT charid FROM users WHERE identifier = ?", { identifier })

        if result and #result > 0 then
            citizenID = result[1].charid
        else
            print("^1[ERROR] Kein Charakter in der Datenbank gefunden!^0")
            TriggerClientEvent("netry_tablet:sendSpielerName", src, "Unbekannter Spieler")
            return
        end
    end

    -- Spielernamen mit CitizenID abrufen
    local result = MySQL.query.await("SELECT firstname, lastname FROM users WHERE id = ?", { citizenID })
    if result and #result > 0 then
        local charName = result[1].firstname .. " " .. result[1].lastname
        TriggerClientEvent("netry_tablet:sendSpielerName", src, charName)
        print("^2[INFO] Spielername abgerufen:", charName, "^0")
    else
        TriggerClientEvent("netry_tablet:sendSpielerName", src, "Unbekannter Spieler")
    end
end)

-- Event zum Initialisieren der CitizenID-Zuordnung (sollte beim Spieler-Joinen passieren)
RegisterNetEvent("esx:playerLoaded")
AddEventHandler("esx:playerLoaded", function(playerId, xPlayer)
    local identifier = xPlayer.identifier
    local citizenID = xPlayer.charid or xPlayer.citizenid -- Falls dein ESX charid oder citizenid speichert

    if citizenID then
        -- Tabellen für die schnellere Abfrage befüllen
        citizenIDTableIdentifier[identifier] = citizenID
        citizenIDTableSource[playerId] = citizenID
        identifierTableCitizenID[citizenID] = identifier
        sourceTableCitizenID[citizenID] = playerId

        print("^2[INFO] CitizenID für Spieler gespeichert:", citizenID, "^0")
    else
        print("^1[ERROR] Keine gültige CitizenID für Spieler gefunden!^0")
    end
end)
-----------------------------------------
-- 📌 SPIELER-DATEN ABRUFEN (NAME, JOB)
-----------------------------------------
RegisterNetEvent("netry_tablet:getSpielerName")
AddEventHandler("netry_tablet:getSpielerName", function()
    local src = source
    local citizenID = getCitizenID(src)

    if not citizenID then
        TriggerClientEvent("netry_tablet:sendSpielerName", src, "Unbekannter Spieler")
        return
    end

    local result = MySQL.query.await("SELECT firstname, lastname FROM users WHERE id = ?", { citizenID })
    if result and #result > 0 then
        local charName = result[1].firstname .. " " .. result[1].lastname
        TriggerClientEvent("netry_tablet:sendSpielerName", src, charName)
    else
        TriggerClientEvent("netry_tablet:sendSpielerName", src, "Unbekannter Spieler")
    end
end)

RegisterNetEvent("tablet:requestPlayerJob")
AddEventHandler("tablet:requestPlayerJob", function()
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    TriggerClientEvent("tablet:receivePlayerJob", src, xPlayer and xPlayer.getJob().name or "unemployed")
end)

-----------------------------------------
-- 🔍 DYNAMISCHE PERSONENSUCHE
-----------------------------------------
---
RegisterNetEvent("netry_tablet:searchPerson")
AddEventHandler("netry_tablet:searchPerson", function(query, job)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)

    if not xPlayer or xPlayer.getJob().name ~= job then
        print("^1[ERROR] Kein Zugriff auf die Personensuche!^0")
        return
    end

    local result = MySQL.query.await("SELECT id, firstname, lastname, dateofbirth, bloodType FROM users WHERE firstname LIKE ? OR lastname LIKE ? OR id = ?",
        { "%" .. query .. "%", "%" .. query .. "%", query }) or {}

    print("^2[INFO] Personensuche ausgeführt für:", query, "Ergebnisse:", #result)
    TriggerClientEvent("netry_tablet:sendSearchResults", src, result)
end)


-----------------------------------------
-- 🚑 MEDIZINISCHE AKTEN (EMS)
-----------------------------------------

RegisterNetEvent("netry_tablet:searchPatients")
AddEventHandler("netry_tablet:searchPatients", function(query)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)

    if not xPlayer or xPlayer.getJob().name ~= "ambulance" then
        print("^1[ERROR] Kein Zugriff auf die Patientensuche!^0")
        return
    end

    local result = MySQL.query.await("SELECT id, firstname, lastname, dateofbirth, bloodType FROM users WHERE firstname LIKE ? OR lastname LIKE ? OR id = ?", 
        { "%" .. query .. "%", "%" .. query .. "%", query }) or {}

    print("^2[INFO] Patientensuche ausgeführt für:", query, "Ergebnisse:", #result)
    TriggerClientEvent("netry_tablet:sendSearchResults", src, result)
end)


-- Verbindung zur Datenbank mit oxmysql
local function fetchFromDatabase(query, params, callback)
    exports.oxmysql:execute(query, params, function(result)
        if callback then callback(result) end
    end)
end

-- API-Endpunkt: Medizinische Informationen aus `users` + `medical_info` abrufen
ESX.RegisterServerCallback("getMedicalInformation", function(source, cb, data)
    local citizenid = data.citizenid

    fetchFromDatabase([[
        SELECT u.firstname, u.lastname, u.dateofbirth AS dob, u.sex AS gender, u.height, 
               m.medication 
        FROM users u
        LEFT JOIN medical_info m ON u.identifier = m.citizenid
        WHERE u.identifier = ?
    ]], {citizenid}, function(result)
        if result and #result > 0 then
            local info = result[1]
            info.name = info.firstname .. " " .. info.lastname
            info.firstname = nil
            info.lastname = nil
            cb(info)
        else
            cb({})
        end
    end)
end)

-- API-Endpunkt: Medizinische Akten abrufen
ESX.RegisterServerCallback("getMedicalRecords", function(source, cb, data)
    fetchFromDatabase("SELECT * FROM medical_records WHERE citizenid = ?", {data.citizenid}, function(result)
        cb(result or {})
    end)
end)

-- 📌 **Callback für medizinische Notizen**
ESX.RegisterServerCallback("getMedicalNotes", function(source, cb, data)
    fetchFromDatabase("SELECT * FROM medical_notes WHERE citizenid = ?", {data.citizenid}, function(result)
        cb(result or {})
    end)
end)

-- 📌 **Callback für psychologische Akten**
ESX.RegisterServerCallback("getPsychologicalRecords", function(source, cb, data)
    fetchFromDatabase("SELECT * FROM medical_psychological_records WHERE citizenid = ?", {data.citizenid}, function(result)
        cb(result or {})
    end)
end)

-- 📌 **Callback für Kontaktinformationen**
ESX.RegisterServerCallback("getContactDetails", function(source, cb, data)
    fetchFromDatabase("SELECT * FROM medical_contact_details WHERE citizenid = ?", {data.citizenid}, function(result)
        cb(result[1] or {})
    end)
end)

ESX = exports["es_extended"]:getSharedObject()

-- 📌 Notiz hinzufügen
ESX.RegisterServerCallback("netry_tablet:addMedicalNote", function(source, cb, data)
    local playerName = GetPlayerName(source)
    exports.oxmysql:execute("INSERT INTO medical_notes (citizenid, note, created_by) VALUES (?, ?, ?)", 
    {data.citizenid, data.note, playerName}, function()
        local lastId = exports.oxmysql:executeSync("SELECT LAST_INSERT_ID() AS id")[1].id
        cb({id = lastId, note = data.note, created_by = playerName})
    end)
end)

-- 📌 Notiz löschen
ESX.RegisterServerCallback("netry_tablet:deleteMedicalNote", function(source, cb, data)
    exports.oxmysql:execute("DELETE FROM medical_notes WHERE id = ?", {data.noteId}, function()
        cb(true)
    end)
end)

-- 📌 Medizinische Akte hinzufügen
ESX.RegisterServerCallback("netry_tablet:createMedicalRecord", function(source, cb, data)
    exports.oxmysql:execute("INSERT INTO medical_records (citizenid, title, description, created_by) VALUES (?, ?, ?, ?)", 
    {data.citizenid, data.title, data.description, GetPlayerName(source)}, function()
        cb(true)
    end)
end)

-- 📌 Medizinische Akte bearbeiten
ESX.RegisterServerCallback("netry_tablet:editMedicalRecord", function(source, cb, data)
    exports.oxmysql:execute("UPDATE medical_records SET title = ?, description = ? WHERE id = ?", 
    {data.title, data.description, data.recordId}, function()
        cb(true)
    end)
end)

-- 📌 Medizinische Akte löschen
ESX.RegisterServerCallback("netry_tablet:deleteMedicalRecord", function(source, cb, data)
    exports.oxmysql:execute("DELETE FROM medical_records WHERE id = ?", {data.recordId}, function()
        cb(true)
    end)
end)

-- 📌 Psychologische Akte hinzufügen
ESX.RegisterServerCallback("netry_tablet:createPsychologicalRecord", function(source, cb, data)
    exports.oxmysql:execute("INSERT INTO medical_psychological_records (citizenid, diagnosis, treatment, created_by) VALUES (?, ?, ?, ?)", 
    {data.citizenid, data.diagnosis, data.treatment, GetPlayerName(source)}, function()
        cb(true)
    end)
end)

-- 📌 Psychologische Akte bearbeiten
ESX.RegisterServerCallback("netry_tablet:editPsychologicalRecord", function(source, cb, data)
    exports.oxmysql:execute("UPDATE medical_psychological_records SET diagnosis = ?, treatment = ? WHERE id = ?", 
    {data.diagnosis, data.treatment, data.recordId}, function()
        cb(true)
    end)
end)	

-- 📌 Psychologische Akte löschen
ESX.RegisterServerCallback("netry_tablet:deletePsychologicalRecord", function(source, cb, data)
    exports.oxmysql:execute("DELETE FROM medical_psychological_records WHERE id = ?", {data.recordId}, function()
        cb(true)
    end)
end)

-- 📌 Kontaktinformationen speichern
ESX.RegisterServerCallback("netry_tablet:updateContactInformation", function(source, cb, data)
    exports.oxmysql:execute("UPDATE medical_contact_details SET phone = ?, discord = ?, email = ? WHERE citizenid = ?", 
    {data.phone, data.discord, data.email, data.citizenid}, function()
        cb(true)
    end)
end)


