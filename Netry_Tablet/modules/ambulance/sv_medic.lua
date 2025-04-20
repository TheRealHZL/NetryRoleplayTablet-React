RegisterNetEvent("netry_tablet:searchPatients")
AddEventHandler("netry_tablet:searchPatients", function(query)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)

    if not xPlayer or xPlayer.getJob().name ~= "ambulance" then
        qtm.Log.Create(src, "netry_tablet:searchPatients", "Unbefugter Zugriff auf Patientensuche")
        return
    end

    local result = MySQL.query.await("SELECT id, firstname, lastname, dateofbirth, bloodType FROM users WHERE firstname LIKE ? OR lastname LIKE ? OR id = ?", 
        { "%" .. query .. "%", "%" .. query .. "%", query }) or {}

        qtm.Log.Create(src, "netry_tablet:searchPatients", ('Spieler: %s, Suche: %s, Ergebnisse: %s'):format(src, query, #result))
    
    TriggerClientEvent("netry_tablet:sendSearchResults", src, result)
end)


-- API-Endpunkt: Medizinische Informationen aus `users` + `medical_info` abrufen
lib.callback.register("getMedicalInformation", function(source, data)
    local citizenid = data.citizenid
    
    -- Logging des Aufrufs
    qtm.Log.Create(source, "netry_tablet:getMedicalInformation", ('Spieler: %s, CitizenID: %s'):format(source, citizenid))

    local result = MySQL.query.await("SELECT firstname, lastname, dateofbirth AS dob, sex AS gender, height FROM users WHERE id = ?", { citizenid })
   
    if result and #result > 0 then
        local info = result[1]
        info.name = info.firstname .. " " .. info.lastname
        
        -- Debugging für Konsole
        print(json.encode(info))
        
        -- Detailliertes Logging mit gefundenen Informationen
        qtm.Log.Create(source, "netry_tablet:getMedicalInformation", ('Spieler: %s, CitizenID: %s, Gefunden: %s, Daten: %s'):format(
            source, 
            citizenid, 
            'true',
            json.encode({
                name = info.name,
                dob = info.dob,
                gender = info.gender,
                height = info.height
            })
        ))
        
        return info
    end

    -- Logging des Fehlschlags
    qtm.Log.Create(source, "netry_tablet:getMedicalInformation", ('Spieler: %s, CitizenID: %s, Gefunden: false'):format(source, citizenid))
    return {}
end)


-- 📌 Alle medizinischen Aufzeichnungen abrufen
lib.callback.register("getMedicalRecords", function(source, data)
    return MySQL.query.await("SELECT * FROM medical_records WHERE citizenid = ?", { data.citizenid }) or {}
end)

-- 📌 Medizinische Notizen abrufen
lib.callback.register("getMedicalNotes", function(source, data)
    return MySQL.query.await("SELECT * FROM medical_notes WHERE citizenid = ?", { data.citizenid }) or {}
end)

-- 📌 Psychologische Akten abrufen
lib.callback.register("getPsychologicalRecords", function(source, data)
    return MySQL.query.await("SELECT * FROM medical_psychological_records WHERE citizenid = ?", { data.citizenid }) or {}
end)

-- 📌 Kontaktinformationen abrufen
lib.callback.register("getContactDetails", function(source, data)
    local result = MySQL.query.await("SELECT * FROM medical_contact_details WHERE citizenid = ?", { data.citizenid })
    return result[1] or {}
end)

-- 📌 Medizinische Notiz hinzufügen
lib.callback.register("addMedicalNote", function(source, data)
    local playerName = GetPlayerName(source)

    local insert = MySQL.insert.await("INSERT INTO medical_notes (citizenid, note, created_by) VALUES (?, ?, ?)", { data.citizenid, data.note, playerName })
    
    if insert then
        qtm.Log.Create(source, "addMedicalNote", ('Spieler: %s, CitizenID: %s, Notiz: %s'):format(playerName, data.citizenid, data.note))
        return { id = insert, note = data.note, created_by = playerName }
    else
        qtm.Log.Create(source, "addMedicalNote", ('FEHLER - Spieler: %s, CitizenID: %s'):format(playerName, data.citizenid))
    end

    return false
end)

-- 📌 Medizinische Notiz löschen
lib.callback.register("deleteMedicalNote", function(source, data)
    local success = MySQL.update.await("DELETE FROM medical_notes WHERE id = ?", { data.noteId }) > 0
    
    if success then
        qtm.Log.Create(source, "deleteMedicalNote", ('Spieler: %s, Notiz ID: %s, Erfolgreich gelöscht'):format(GetPlayerName(source), data.noteId))
    else
        qtm.Log.Create(source, "deleteMedicalNote", ('FEHLER - Spieler: %s, Notiz ID: %s, Löschen fehlgeschlagen'):format(GetPlayerName(source), data.noteId))
    end
    
    return success
end)

-- 📌 Medizinische Akte hinzufügen
lib.callback.register("createMedicalRecord", function(source, data)
    local playerName = GetPlayerName(source)
    local success = MySQL.insert.await("INSERT INTO medical_records (citizenid, title, description, created_by) VALUES (?, ?, ?, ?)", 
        { data.citizenid, data.diagnosis, data.treatment, playerName }) ~= nil
        
    if success then
        qtm.Log.Create(source, "createMedicalRecord", ('Spieler: %s, CitizenID: %s, Diagnose: %s, Behandlung: %s'):format(playerName, data.citizenid, data.diagnosis, data.treatment))
    else
        qtm.Log.Create(source, "createMedicalRecord", ('FEHLER - Spieler: %s, CitizenID: %s'):format(playerName, data.citizenid))
    end
        
    return success
end)

-- 📌 Medizinische Akte bearbeiten
lib.callback.register("updateMedicalRecord", function(source, data)
    local success = MySQL.update.await("UPDATE medical_records SET diagnosis = ?, treatment = ? WHERE id = ?", 
        { data.diagnosis, data.treatment, data.recordId }) > 0
    
    if success then
        qtm.Log.Create(source, "updateMedicalRecord", ('Spieler: %s, Akte ID: %s, Neue Diagnose: %s, Neue Behandlung: %s'):format(GetPlayerName(source), data.recordId, data.diagnosis, data.treatment))
    else
        qtm.Log.Create(source, "updateMedicalRecord", ('FEHLER - Spieler: %s, Akte ID: %s, Update fehlgeschlagen'):format(GetPlayerName(source), data.recordId))
    end
    
    return success
end)

-- 📌 Medizinische Akte löschen
lib.callback.register("deleteMedicalRecord", function(source, data)
    local success = MySQL.update.await("DELETE FROM medical_records WHERE id = ?", { data.recordId }) > 0
    
    if success then
        qtm.Log.Create(source, "deleteMedicalRecord", ('Spieler: %s, Akte ID: %s, Erfolgreich gelöscht'):format(GetPlayerName(source), data.recordId))
    else
        qtm.Log.Create(source, "deleteMedicalRecord", ('FEHLER - Spieler: %s, Akte ID: %s, Löschen fehlgeschlagen'):format(GetPlayerName(source), data.recordId))
    end
    
    return success
end)

-- 📌 Psychologische Akte hinzufügen
lib.callback.register("createPsychologicalRecord", function(source, data)
    local playerName = GetPlayerName(source)
    local success = MySQL.insert.await("INSERT INTO medical_psychological_records (citizenid, diagnosis, treatment, created_by) VALUES (?, ?, ?, ?)", 
        { data.citizenid, data.diagnosis, data.treatment, playerName }) ~= nil
    
    if success then
        qtm.Log.Create(source, "createPsychologicalRecord", ('Spieler: %s, CitizenID: %s, Diagnose: %s, Behandlung: %s'):format(playerName, data.citizenid, data.diagnosis, data.treatment))
    else
        qtm.Log.Create(source, "createPsychologicalRecord", ('FEHLER - Spieler: %s, CitizenID: %s'):format(playerName, data.citizenid))
    end
    
    return success
end)

-- 📌 Psychologische Akte bearbeiten
lib.callback.register("updatePsychologicalRecord", function(source, data)
    local success = MySQL.update.await("UPDATE medical_psychological_records SET diagnosis = ?, treatment = ? WHERE id = ?", 
        { data.diagnosis, data.treatment, data.recordId }) > 0
    
    if success then
        qtm.Log.Create(source, "updatePsychologicalRecord", ('Spieler: %s, Akte ID: %s, Neue Diagnose: %s, Neue Behandlung: %s'):format(GetPlayerName(source), data.recordId, data.diagnosis, data.treatment))
    else
        qtm.Log.Create(source, "updatePsychologicalRecord", ('FEHLER - Spieler: %s, Akte ID: %s, Update fehlgeschlagen'):format(GetPlayerName(source), data.recordId))
    end
    
    return success
end)

-- 📌 Psychologische Akte löschen
lib.callback.register("deletePsychologicalRecord", function(source, data)
    local success = MySQL.update.await("DELETE FROM medical_psychological_records WHERE id = ?", { data.recordId }) > 0
    
    if success then
        qtm.Log.Creat(source, "deletePsychologicalRecord", ('Spieler: %s, Akte ID: %s, Erfolgreich gelöscht'):format(GetPlayerName(source), data.recordId))
    else
        qtm.Log.Creat(source, "deletePsychologicalRecord", ('FEHLER - Spieler: %s, Akte ID: %s, Löschen fehlgeschlagen'):format(GetPlayerName(source), data.recordId))
    end
    
    return success
end)

-- 📌 Kontaktinformationen speichern
lib.callback.register("saveContactDetails", function(source, data)
    local success = MySQL.update.await("INSERT INTO medical_contact_details (citizenid, phone, discord, email) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE phone = ?, discord = ?, email = ?", 
    { data.citizenid, data.phone, data.discord, data.email, data.phone, data.discord, data.email }) > 0
    
    if success then
        qtm.Log.Creat(source, "saveContactDetails", ('Spieler: %s, CitizenID: %s, Telefon: %s, Discord: %s, Email: %s'):format(GetPlayerName(source), data.citizenid, data.phone, data.discord, data.email))
    else
        qtm.Log.Creat(source, "saveContactDetails", ('FEHLER - Spieler: %s, CitizenID: %s, Speichern fehlgeschlagen'):format(GetPlayerName(source), data.citizenid))
    end
    
    return success
end)