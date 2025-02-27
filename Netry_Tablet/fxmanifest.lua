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

client_scripts {
    'client.lua'
}

server_scripts {
    'server.lua',
    '@oxmysql/lib/MySQL.lua',
    '@netry-lib/imports.lua'

}

lua54 'yes'

dependency 'oxmysql'