//Para registrar comandos no bot
//Toda vez que criar um arquivo de comando novo tem que executar esse js para registrar no bot os comandos

const {REST, Routes} = require('discord.js')

//dotenv
const dotenv = require('dotenv');
dotenv.config()
const {TOKEN, CLIENT_ID, GUILD_ID} = process.env

//importação dos comandos
const fs = require('node:fs')
const path = require('node:path')
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

const commands = []

for (const file of commandFiles){
    const command = require(`./commands/${file}`)
    commands.push(command.data.toJSON())
}

//instancia REST
const rest = new REST({version: '10'}).setToken(TOKEN);

//Deploy

(async () =>{
    try{
        console.log(`Resetando ${commands.length} comandos...`)

        //PUT
        const data = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        {body: commands}
        )
    }catch{
        console.error(error)
    }
})()