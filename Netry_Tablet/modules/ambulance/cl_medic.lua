-- 📌 Medizinische Informationen abrufen
RegisterNUICallback("getMedicalInformation", function(data, cb)
    local result = lib.callback.await("getMedicalInformation", false, { citizenid = data.citizenid })
    cb(result or {})
end)

-- 📌 Medizinische Akten abrufen
RegisterNUICallback("getMedicalRecords", function(data, cb)
    local result = lib.callback.await("getMedicalRecords", false, { citizenid = data.citizenid })
    cb(result or {})
end)

-- 📌 Medizinische Notizen abrufen
RegisterNUICallback("getMedicalNotes", function(data, cb)
    local result = lib.callback.await("getMedicalNotes", false, { citizenid = data.citizenid })
    cb(result or {})
end)

-- 📌 Psychologische Akten abrufen
RegisterNUICallback("getPsychologicalRecords", function(data, cb)
    local result = lib.callback.await("getPsychologicalRecords", false, { citizenid = data.citizenid })
    cb(result or {})
end)

-- 📌 Kontaktinformationen abrufen
RegisterNUICallback("getContactDetails", function(data, cb)
    local result = lib.callback.await("getContactDetails", false, { citizenid = data.citizenid })
    cb(result or {})
end)

-- 📌 Notiz hinzufügen
RegisterNUICallback("addMedicalNote", function(data, cb)
    local success = lib.callback.await("addMedicalNote", false, { citizenid = data.citizenid, note = data.note })
    cb(success)
end)

-- 📌 Notiz löschen
RegisterNUICallback("deleteMedicalNote", function(data, cb)
    local success = lib.callback.await("deleteMedicalNote", false, { noteId = data.noteId })
    cb(success)
end)

-- 📌 Medizinische Akte hinzufügen
RegisterNUICallback("createMedicalRecord", function(data, cb)
    local success = lib.callback.await("createMedicalRecord", false, {
        citizenid = data.citizenid,
        diagnosis = data.diagnosis,
        treatment = data.treatment,
        created_by = GetPlayerName(PlayerId())
    })
    cb(success)
end)

-- 📌 Medizinische Akte löschen
RegisterNUICallback("deleteMedicalRecord", function(data, cb)
    local success = lib.callback.await("deleteMedicalRecord", false, { recordId = data.recordId })
    cb(success)
end)

-- 📌 Psychologische Akte hinzufügen
RegisterNUICallback("createPsychologicalRecord", function(data, cb)
    local success = lib.callback.await("createPsychologicalRecord", false, {
        citizenid = data.citizenid,
        diagnosis = data.diagnosis,
        treatment = data.treatment,
        created_by = GetPlayerName(PlayerId())
    })
    cb(success)
end)

-- 📌 Psychologische Akte löschen
RegisterNUICallback("deletePsychologicalRecord", function(data, cb)
    local success = lib.callback.await("deletePsychologicalRecord", false, { recordId = data.recordId })
    cb(success)
end)

-- 📌 Kontaktinformationen speichern
RegisterNUICallback("saveContactDetails", function(data, cb)
    local success = lib.callback.await("saveContactDetails", false, {
        citizenid = data.citizenid,
        phone = data.phone,
        discord = data.discord,
        email = data.email
    })
    cb(success)
end)
