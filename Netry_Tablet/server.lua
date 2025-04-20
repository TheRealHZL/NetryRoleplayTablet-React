ESX = exports["es_extended"]:getSharedObject()

local yamlSettings = {}


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





lib.callback.register("netry_Tablet:getPlayerJobEmployeeList", function(source, _)
    local xPlayer = ESX.GetPlayerFromId(source)
    if xPlayer and xPlayer.job then
        return { id = xPlayer.job.name, label = xPlayer.job.label }
    end
    return nil
end)


lib.callback.register("netry_Tablet:getEmployees", function(source, job)
    local employees = {}

    local result = MySQL.query.await("SELECT identifier, firstname, lastname, phone_number, job_grade FROM users WHERE job = ?", { job })

    if result and #result > 0 then
        for _, v in pairs(result) do
            table.insert(employees, {
                id = v.identifier,
                name = v.firstname .. " " .. v.lastname,
                job_grade = v.job_grade,
                phone = v.phone_number or "Unbekannt",
                email = v.identifier .. "@email.com"
            })
        end
    end

    return employees
end)

