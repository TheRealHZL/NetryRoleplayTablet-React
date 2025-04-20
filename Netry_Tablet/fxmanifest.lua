fx_version 'cerulean'
game 'gta5'
author 'MRH Scripts X Netry Studio'
description 'Netry Tablet'
version '1.0.0'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/**/*'
}


dependencies {
	'qtm-lib',
	'ox_lib',
	'oxmysql',
}

lua54 'yes'

client_scripts {
    'client.lua',

    'modules/dispatchcenter/cl_dc.lua',
    'modules/ambulance/cl_medic.lua',
    'modules/police/cl_police.lua',
    'modules/fire/cl_fire.lua',
    'modules/mechanic/cl_mechanic.lua'
}


server_scripts {
    'server.lua',

    'modules/dispatchcenter/sv_dc.lua',
    'modules/ambulance/sv_medic.lua',
    'modules/police/sv_police.lua',
    'modules/fire/sv_fire.lua',
    'modules/mechanic/sv_mechanic.lua'
}

shared_script {
    '@ox_lib/init.lua',
    '@qtm-lib/imports.lua',
    '@netry-lib/imports.lua',
    '@oxmysql/lib/MySQL.lua'
}



