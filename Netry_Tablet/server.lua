ESX = exports["es_extended"]:getSharedObject()

local yamlSettings = {}

local lib = exports.ox_lib
if not lib then
    print("^1[ERROR] ox_lib nicht geladen! Stelle sicher, dass 'ensure ox_lib' in server.cfg ist.^0")
    return
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
RegisterNetEvent("netry_tablet:searchPerson")
AddEventHandler("netry_tablet:searchPerson", function(query)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    local callback = nil

    if job == "ambulance" then
        callback = "sendSearchResultsEMS"
    elseif job == "police" or job == "doj" then
        callback = "sendSearchResultsPolice"
    elseif job == "fib" then
        callback = "sendSearchResultsFIB"
    elseif job == "mechanic" then
        callback = "sendSearchResultsMechanic"
    else
        print("^1[ERROR] Zugriff verweigert: Keine Berechtigung für die Suche!^0")
        return
    end

    local result = MySQL.query.await("SELECT id, firstname, lastname FROM users WHERE firstname LIKE ? OR lastname LIKE ? OR id = ?", 
        { "%" .. query .. "%", "%" .. query .. "%", query })

    TriggerClientEvent("netry_tablet:" .. callback, src, result or {})
end)

-----------------------------------------
-- 🚑 MEDIZINISCHE AKTEN (EMS)
-----------------------------------------
RegisterNetEvent("netry_tablet:getMedicalRecords")
AddEventHandler("netry_tablet:getMedicalRecords", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "ambulance" then return end

    local records = MySQL.query.await("SELECT * FROM medical_records WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendMedicalRecords", src, records or {})
end)

RegisterNetEvent("netry_tablet:createMedicalRecord")
AddEventHandler("netry_tablet:createMedicalRecord", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "ambulance" then return end

    MySQL.insert("INSERT INTO medical_records (citizenid, title, description, diagnosis, treatment, prescribed_medication, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        { data.citizenid, data.title, data.description, data.diagnosis, data.treatment, data.prescribed_medication, xPlayer.getName() })

    TriggerClientEvent("netry_tablet:medicalRecordCreated", src)
end)

-----------------------------------------
-- 📝 MEDIZINISCHE NOTIZEN (EMS)
-----------------------------------------
RegisterNetEvent("netry_tablet:getMedicalNotes")
AddEventHandler("netry_tablet:getMedicalNotes", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "ambulance" then return end

    local notes = MySQL.query.await("SELECT * FROM medical_notes WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendMedicalNotes", src, notes or {})
end)

RegisterNetEvent("netry_tablet:addMedicalNote")
AddEventHandler("netry_tablet:addMedicalNote", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "ambulance" then return end

    MySQL.insert("INSERT INTO medical_notes (citizenid, note, created_by) VALUES (?, ?, ?)", 
        { data.citizenid, data.note, xPlayer.getName() })

    TriggerClientEvent("netry_tablet:medicalNoteAdded", src)
end)

-----------------------------------------
-- 💊 MEDIZINISCHE INFORMATIONEN (EMS)
-----------------------------------------
RegisterNetEvent("netry_tablet:getMedicalInformation")
AddEventHandler("netry_tablet:getMedicalInformation", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "ambulance" then return end

    local info = MySQL.query.await("SELECT * FROM medical_information WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendMedicalInformation", src, info or {})
end)

RegisterNetEvent("netry_tablet:saveMedicalInformation")
AddEventHandler("netry_tablet:saveMedicalInformation", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "ambulance" then return end

    MySQL.insert("INSERT INTO medical_information (citizenid, medication, dosage, treatment, notes) VALUES (?, ?, ?, ?, ?)", 
        { data.citizenid, data.medication, data.dosage, data.treatment, data.notes })
    
    TriggerClientEvent("netry_tablet:medicalInformationSaved", src)
end)

-----------------------------------------
-- 🧠 PSYCHOLOGISCHE AKTEN (EMS)
-----------------------------------------
RegisterNetEvent("netry_tablet:getPsychologicalRecords")
AddEventHandler("netry_tablet:getPsychologicalRecords", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "ambulance" then return end

    local records = MySQL.query.await("SELECT * FROM psychological_records WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendPsychologicalRecords", src, records or {})
end)

RegisterNetEvent("netry_tablet:createPsychologicalRecord")
AddEventHandler("netry_tablet:createPsychologicalRecord", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "ambulance" then return end

    MySQL.insert("INSERT INTO psychological_records (citizenid, diagnosis, treatment, risk_assessment, created_by) VALUES (?, ?, ?, ?, ?)", 
        { data.citizenid, data.diagnosis, data.treatment, data.risk_assessment, xPlayer.getName() })

    TriggerClientEvent("netry_tablet:psychologicalRecordCreated", src)
end)

-----------------------------------------
-- 📝 POLIZEI NOTIZEN
-----------------------------------------

RegisterNetEvent("netry_tablet:getPoliceRecords")
AddEventHandler("netry_tablet:getPoliceRecords", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "police" and xPlayer.getJob().name ~= "doj" then return end

    local records = MySQL.query.await("SELECT * FROM police_and_justice_records WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendPoliceRecords", src, records or {})
end)

RegisterNetEvent("netry_tablet:createPoliceRecord")
AddEventHandler("netry_tablet:createPoliceRecord", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "police" and xPlayer.getJob().name ~= "doj" then return end

    MySQL.insert("INSERT INTO police_and_justice_records (citizenid, title, description, offense, penalty, officer, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        { data.citizenid, data.title, data.description, data.offense, data.penalty, xPlayer.getName(), xPlayer.getName() })

    TriggerClientEvent("netry_tablet:policeRecordCreated", src)
end)

RegisterNetEvent("netry_tablet:deletePoliceRecord")
AddEventHandler("netry_tablet:deletePoliceRecord", function(recordId)
    local src = source
    MySQL.execute("DELETE FROM police_and_justice_records WHERE id = ?", { recordId })
    TriggerClientEvent("netry_tablet:policeRecordDeleted", src)
end)

RegisterNetEvent("netry_tablet:getNegotiations")
AddEventHandler("netry_tablet:getNegotiations", function()
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "police" and xPlayer.getJob().name ~= "doj" then return end

    local negotiations = MySQL.query.await("SELECT * FROM negotiations")
    TriggerClientEvent("netry_tablet:sendNegotiations", src, negotiations or {})
end)

RegisterNetEvent("netry_tablet:createNegotiation")
AddEventHandler("netry_tablet:createNegotiation", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "police" and xPlayer.getJob().nam

    MySQL.insert("INSERT INTO negotiations (citizenid, title, description, created_by) VALUES (?, ?, ?, ?)",
    { data.citizenid, data.title, data.description, xPlayer.getName() })
    TriggerClientEvent("netry_tablet:negotiationCreated", src)
    end)

RegisterNetEvent("netry_tablet:deleteNegotiation")
AddEventHandler("netry_tablet:deleteNegotiation", function(negotiationId)
    local src = source
    MySQL.execute("DELETE FROM negotiations WHERE id = ?", { negotiationId })
    TriggerClientEvent("netry_tablet:negotiationDeleted", src)
end)

RegisterNetEvent("netry_tablet:saveNegotiation")
AddEventHandler("netry_tablet:saveNegotiation", function(data)
    local src = source
    MySQL.update("UPDATE negotiations SET title = ?, description = ? WHERE id = ?", { data.title, data.description, data.id })
    TriggerClientEvent("netry_tablet:negotiationSaved", src)
end)

RegisterNetEvent("netry_tablet:getPenaltyCatalog")
AddEventHandler("netry_tablet:getPenaltyCatalog", function()
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "police" and xPlayer.getJob().name ~= "doj" then return end
    local penaltyCatalog = MySQL.query.await("SELECT * FROM penalty_catalog")
    TriggerClientEvent("netry_tablet:sendPenaltyCatalog", src, penaltyCatalog or {})
end)

RegisterNetEvent("netry_tablet:modifiePenaltyCatalog")
AddEventHandler("netry_tablet:modifiePenaltyCatalog", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "police" and xPlayer.getJob().name ~= "doj" then return end
    MySQL.update("UPDATE penalty_catalog SET title = ?, description = ?, penalty = ? WHERE id = ?", { data.title, data.description, data.penalty, data.id })
    TriggerClientEvent("netry_tablet:penaltyCatalogModified", src)
end)

RegisterNetEvent("netry_tablet:deletEntryFromPenaltyCatalog")
AddEventHandler("netry_tablet:deletEntryFromPenaltyCatalog", function(id)
    local src = source
    MySQL.execute("DELETE FROM penalty_catalog WHERE id = ?", { id })
    TriggerClientEvent("netry_tablet:penaltyCatalogEntryDeleted", src)
end)

----------------------------------------
-- Mechanic Stuff
----------------------------------------

RegisterNetEvent("netry_tablet:getMechanicRecords")
AddEventHandler("netry_tablet:getMechanicRecords", function()
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "mechanic" then return end
    local mechanicRecords = MySQL.query.await("SELECT * FROM mechanic_records")
    TriggerClientEvent("netry_tablet:sendMechanicRecords", src, mechanicRecords or {})
end)

RegisterNetEvent("netry_tablet:createMechanicRecord")
AddEventHandler("netry_tablet:createMechanicRecord", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "mechanic" then return end
    MySQL.insert("INSERT INTO mechanic_records (citizenid, title, description, vehicle, created_by) VALUES (?, ?, ?, ?, ?)",
    { data.citizenid, data.title, data.description, data.vehicle, xPlayer.getName() })
    TriggerClientEvent("netry_tablet:mechanicRecordCreated", src)
end)

RegisterNetEvent("netry_tablet:deleteMechanicRecord")
AddEventHandler("netry_tablet:deleteMechanicRecord", function(recordId)
    local src = source
    MySQL.execute("DELETE FROM mechanic_records WHERE id = ?", { recordId })
    TriggerClientEvent("netry_tablet:mechanicRecordDeleted", src)
end)

RegisterNetEvent("netry_tablet:saveMechanicRecord")
AddEventHandler("netry_tablet:saveMechanicRecord", function(data)
    local src = source
    MySQL.update("UPDATE mechanic_records SET title = ?, description = ? WHERE id = ?", { data.title, data.description, data.id })
    TriggerClientEvent("netry_tablet:mechanicRecordSaved", src)
end)

RegisterNetEvent("netry_tablet:getVehicleModifications")
AddEventHandler("netry_tablet:getVehicleModifications", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "mechanic" then return end
    local vehicleModifications = MySQL.query.await("SELECT * FROM vehicle_modifications WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendVehicleModifications", src, vehicleModifications or {})
end)

RegisterNetEvent("netry_tablet:createVehicleModification")
AddEventHandler("netry_tablet:createVehicleModification", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "mechanic" then return end
    MySQL.insert("INSERT INTO vehicle_modifications (citizenid, vehicle, modification, created_by) VALUES (?, ?, ?, ?)",
    { data.citizenid, data.vehicle, data.modification, xPlayer.getName() })
    TriggerClientEvent("netry_tablet:vehicleModificationCreated", src)
end)

RegisterNetEvent("netry_tablet:deleteVehicleModification")
AddEventHandler("netry_tablet:deleteVehicleModification", function(modificationId)
    local src = source
    MySQL.execute("DELETE FROM vehicle_modifications WHERE id = ?", { modificationId })
    TriggerClientEvent("netry_tablet:vehicleModificationDeleted", src)
end)

RegisterNetEvent("netry_tablet:saveVehicleModification")
AddEventHandler("netry_tablet:saveVehicleModification", function(data)
    local src = source
    MySQL.update("UPDATE vehicle_modifications SET vehicle = ?, modification = ? WHERE id = ?", { data.vehicle, data.modification, data.id })
    TriggerClientEvent("netry_tablet:vehicleModificationSaved", src)
end)

RegisterNetEvent("netry_tablet:getVehicleNotes")
AddEventHandler("netry_tablet:getVehicleNotes", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "mechanic" then return end
    local vehicleNotes = MySQL.query.await("SELECT * FROM vehicle_notes WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendVehicleNotes", src, vehicleNotes or {})
end)

RegisterNetEvent("netry_tablet:createVehicleNote")
AddEventHandler("netry_tablet:createVehicleNote", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.getJob().name ~= "mechanic" then return end
    MySQL.insert("INSERT INTO vehicle_notes (citizenid, vehicle, note, created_by) VALUES (?, ?, ?, ?)",
    { data.citizenid, data.vehicle, data.note, xPlayer.getName() })
    TriggerClientEvent("netry_tablet:vehicleNoteCreated", src)
end)

RegisterNetEvent("netry_tablet:deleteVehicleNote")
AddEventHandler("netry_tablet:deleteVehicleNote", function(noteId)
    local src = source
    MySQL.execute("DELETE FROM vehicle_notes WHERE id = ?", { noteId })
    TriggerClientEvent("netry_tablet:vehicleNoteDeleted", src)
end)

RegisterNetEvent("netry_tablet:saveVehicleNote")
AddEventHandler("netry_tablet:saveVehicleNote", function(data)
    local src = source
    MySQL.update("UPDATE vehicle_notes SET vehicle = ?, note = ? WHERE id = ?", { data.vehicle, data.note, data.id })
    TriggerClientEvent("netry_tablet:vehicleNoteSaved", src)
end)

