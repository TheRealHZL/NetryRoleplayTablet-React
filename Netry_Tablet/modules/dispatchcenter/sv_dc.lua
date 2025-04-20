local EMSStaff = {}

lib.callback.register("dispatch:getEMSStaff", function(source)
    return EMSStaff
end)

lib.callback.register("dispatch:updateEMSStaff", function(source, data)
    for i, staff in ipairs(EMSStaff) do
        if staff.id == data.id then
            EMSStaff[i][data.field] = data.value
            break
        end
    end
    return true
end)

lib.callback.register("dispatch:addEMSStaff", function(source, data)
    local newEntry = {
        id = #EMSStaff + 1,
        firstname = data.firstname,
        lastname = data.lastname,
        unit = data.unit,
        status = data.status,
        role = data.role,
        vehicle = data.vehicle
    }
    table.insert(EMSStaff, newEntry)
    return true
end)

lib.callback.register("dispatch:removeEMSStaff", function(source, data)
    for i, staff in ipairs(EMSStaff) do
        if staff.id == data.id then
            table.remove(EMSStaff, i)
            break
        end
    end
    return true
end)