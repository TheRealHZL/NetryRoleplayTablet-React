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

-- Job an Client senden
RegisterNetEvent("tablet:requestPlayerJob")
AddEventHandler("tablet:requestPlayerJob", function()
    local src = source
    if not src then return end

    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer then
        TriggerClientEvent("tablet:receivePlayerJob", src, xPlayer.getJob().name)
    else
        TriggerClientEvent("tablet:receivePlayerJob", src, "unemployed")
    end
end)

-- Event zum Initialisieren der CitizenID-Zuordnung (sollte beim Spieler-Joinen passieren)
RegisterNetEvent("esx:playerLoaded")
AddEventHandler("esx:playerLoaded", function(playerId, xPlayer)
    local identifier = xPlayer.identifier
    local citizenID = xPlayer.charid or xPlayer.citizenid -- Falls dein ESX `charid` oder `citizenid` speichert

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

RegisterNetEvent("netry_tablet:searchPerson")
AddEventHandler("netry_tablet:searchPerson", function(query)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local result = MySQL.query.await("SELECT id, firstname, lastname FROM users WHERE firstname LIKE ? OR lastname LIKE ? OR id = ?", 
        { "%" .. query .. "%", "%" .. query .. "%", query })

    if not result or #result == 0 then
        TriggerClientEvent("netry_tablet:sendSearchResults", src, {})
        return
    end

    local persons = {}

    for _, user in ipairs(result) do
        table.insert(persons, {
            citizenid = user.id,
            firstname = user.firstname,
            lastname = user.lastname
        })
    end

    TriggerClientEvent("netry_tablet:sendSearchResults", src, persons)
end)


-- Medical Stuff --

RegisterNetEvent("netry_tablet:getMedicalRecords")
AddEventHandler("netry_tablet:getMedicalRecords", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "ambulance" then return end -- Nur EMS

    local records = MySQL.query.await("SELECT * FROM medical_records WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendMedicalRecords", src, records or {})
end)

RegisterNetEvent("netry_tablet:createMedicalRecord")
AddEventHandler("netry_tablet:createMedicalRecord", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "ambulance" then return end -- Nur EMS

    MySQL.insert("INSERT INTO medical_records (citizenid, title, description, diagnosis, treatment, prescribed_medication, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        { data.citizenid, data.title, data.description, data.diagnosis, data.treatment, data.prescribed_medication, xPlayer.getName() })

    TriggerClientEvent("netry_tablet:medicalRecordCreated", src)
end)

-- Medical Notes --

RegisterNetEvent("netry_tablet:getMedicalNotes")
AddEventHandler("netry_tablet:getMedicalNotes", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "ambulance" then return end -- Nur EMS kann Notizen abrufen

    local notes = MySQL.query.await("SELECT * FROM medical_notes WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendMedicalNotes", src, notes or {})
end)

RegisterNetEvent("netry_tablet:addMedicalNote")
AddEventHandler("netry_tablet:addMedicalNote", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "ambulance" then return end -- Nur EMS kann Notizen hinzufügen

    MySQL.insert("INSERT INTO medical_notes (citizenid, note, created_by) VALUES (?, ?, ?)", 
        { data.citizenid, data.note, xPlayer.getName() })

    TriggerClientEvent("netry_tablet:medicalNoteAdded", src)
end)


-- Psychological Stuff --

RegisterNetEvent("netry_tablet:getPsychologicalRecords")
AddEventHandler("netry_tablet:getPsychologicalRecords", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "ambulance" then return end -- Nur EMS

    local records = MySQL.query.await("SELECT * FROM psychological_records WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendPsychologicalRecords", src, records or {})
end)

RegisterNetEvent("netry_tablet:createPsychologicalRecord")
AddEventHandler("netry_tablet:createPsychologicalRecord", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "ambulance" then return end -- Nur EMS

    MySQL.insert("INSERT INTO psychological_records (citizenid, diagnosis, treatment, risk_assessment, created_by) VALUES (?, ?, ?, ?, ?)", 
        { data.citizenid, data.diagnosis, data.treatment, data.risk_assessment, xPlayer.getName() })

    TriggerClientEvent("netry_tablet:psychologicalRecordCreated", src)
end)

-- Medical Information --

RegisterNetEvent("netry_tablet:getMedicalInformation")
AddEventHandler("netry_tablet:getMedicalInformation", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "ambulance" then return end -- Nur EMS kann auf medizinische Daten zugreifen

    local info = MySQL.query.await("SELECT * FROM medical_information WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendMedicalInformation", src, info or {})
end)


RegisterNetEvent("netry_tablet:saveMedicalInformation")
AddEventHandler("netry_tablet:saveMedicalInformation", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "ambulance" then return end -- Nur EMS kann medizinische Daten speichern

    local existing = MySQL.query.await("SELECT id FROM medical_information WHERE citizenid = ?", { data.citizenid })

    if existing and #existing > 0 then
        MySQL.update("UPDATE medical_information SET medication = ?, dosage = ?, treatment = ?, notes = ? WHERE citizenid = ?", 
            { data.medication, data.dosage, data.treatment, data.notes, data.citizenid })
    else
        MySQL.insert("INSERT INTO medical_information (citizenid, medication, dosage, treatment, notes) VALUES (?, ?, ?, ?, ?)", 
            { data.citizenid, data.medication, data.dosage, data.treatment, data.notes })
    end
    TriggerClientEvent("netry_tablet:medicalInformationSaved", src)
end)



-- Police and Justice Stuff --

RegisterNetEvent("netry_tablet:getPoliceRecords")
AddEventHandler("netry_tablet:getPoliceRecords", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "police" and job ~= "doj" then return end -- Nur Polizei und Justiz

    local records = MySQL.query.await("SELECT * FROM police_and_justice_records WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendPoliceRecords", src, records or {})
end)

RegisterNetEvent("netry_tablet:createPoliceRecord")
AddEventHandler("netry_tablet:createPoliceRecord", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "police" and job ~= "doj" then return end -- Nur Polizei und Justiz

    MySQL.insert("INSERT INTO police_and_justice_records (citizenid, title, description, offense, penalty, officer, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        { data.citizenid, data.title, data.description, data.offense, data.penalty, xPlayer.getName(), xPlayer.getName() })

    TriggerClientEvent("netry_tablet:policeRecordCreated", src)
end)


-- Strafenkatalog --

RegisterNetEvent("netry_tablet:getPenaltyCatalog")
AddEventHandler("netry_tablet:getPenaltyCatalog", function()
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "police" and job ~= "doj" then return end -- Nur Polizei und Justiz

    local catalog = MySQL.query.await("SELECT * FROM penalty_catalog")
    TriggerClientEvent("netry_tablet:sendPenaltyCatalog", src, catalog or {})
end)

RegisterNetEvent("netry_tablet:modifiePenaltyCatalog")
AddEventHandler("netry_tablet:modifiePenaltyCatalog", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "police" and job ~= "doj" then return end -- Nur Polizei und Justiz    

    MySQL.update("UPDATE penalty_catalog SET title = ?, description = ?, penalty = ? WHERE id = ?", 
        { data.title, data.description, data.penalty, data.id })

    TriggerClientEvent("netry_tablet:penaltyCatalogModified", src)
end)

RegisterNetEvent("netry_tablet:deletEntryFromPenaltyCatalog")
AddEventHandler("netry_tablet:deletEntryFromPenaltyCatalog", function(id)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "police" and job ~= "doj" then return end -- Nur Polizei und Justiz

    MySQL.delete("DELETE FROM penalty_catalog WHERE id = ?", { id })

    TriggerClientEvent("netry_tablet:penaltyCatalogEntryDeleted", src)
end)

RegisterNetEvent("netry_tablet:getNegotiations")
AddEventHandler("netry_tablet:getNegotiations", function()
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local job = xPlayer.getJob().name
    if job ~= "police" and job ~= "doj" then return end -- Nur Polizei und Justiz

    local negotiations = MySQL.query.await("SELECT * FROM negotiations")
    TriggerClientEvent("netry_tablet:sendNegotiations", src, negotiations or {})
    end)

RegisterNetEvent("netry_tablet:createNegotiation")
AddEventHandler("netry_tablet:createNegotiation", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end
    local job = xPlayer.getJob().name
    if job ~= "police" and job ~= "doj" then return end -- Nur Polizei und Justiz
    MySQL.insert("INSERT INTO negotiations (title, description, penalty, created_at) VALUES (?, ?, ?, ?)",
    { data.title, data.description, data.penalty, os.time() })
    TriggerClientEvent("netry_tablet:negotiationCreated", src)
end)


-- Mechanic Stuff --

RegisterNetEvent("netry_tablet:getMechanicRecords")
AddEventHandler("netry_tablet:getMechanicRecords", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end
    local job = xPlayer.getJob().name
    if job ~= "mechanic" then return end -- Nur Mechaniker

    local records = MySQL.query.await("SELECT * FROM mechanic_records WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendMechanicRecords", src, records or {})
    end)

RegisterNetEvent("netry_tablet:createMechanicRecord")
AddEventHandler("netry_tablet:createMechanicRecord", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end
    local job = xPlayer.getJob().name
    if job ~= "mechanic" then return end -- Nur Mechaniker
    MySQL.insert("INSERT INTO mechanic_records (citizenid, title, description, vehicle, created_by) VALUES (?, ?, ?, ?, ?)", { data.citizenid, data.title, data.description, data.vehicle, xPlayer.getName() })
    TriggerClientEvent("netry_tablet:mechanicRecordCreated", src)
end)

RegisterNetEvent("netry_tablet:getVehicleModifications")
AddEventHandler("netry_tablet:getVehicleModifications", function(citizenid)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end
    local job = xPlayer.getJob().name
    if job ~= "mechanic" then return end -- Nur Mechaniker

    local modifications = MySQL.query.await("SELECT * FROM vehicle_modifications WHERE citizenid = ?", { citizenid })
    TriggerClientEvent("netry_tablet:sendVehicleModifications", src, modifications or {})
    end)

RegisterNetEvent("netry_tablet:createVehicleModification")
AddEventHandler("netry_tablet:createVehicleModification", function(data)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end
    local job = xPlayer.getJob().name
    if job ~= "mechanic" then return end -- Nur Mechaniker
    MySQL.insert("INSERT INTO vehicle_modifications (citizenid, vehicle, modification, created_by) VALUES (?, ?, ?, ?)", { data.citizenid, data.vehicle, data.modification, xPlayer.getName() })
    TriggerClientEvent("netry_tablet:vehicleModificationCreated", src)
end)




