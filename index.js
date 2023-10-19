
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

//dotenv para proteger os dados importantes, como token, client e guild
//que serão utilizados no login
const dotenv = require('dotenv');
dotenv.config()
const {TOKEN, CLIENT_ID, GUILD_ID} = process.env

//importação dos comandos
//Comando nativo do node para ler arquivos
const fs = require('node:fs')
//Comando nativo do node para buscar caminhos/diretorios
const path = require('node:path')

//Pega o caminho dos commands
const commandsPath = path.join(__dirname, 'commands')
//Vai ler apenas os arquivos .js
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection()

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ("data" in command && "execute" in command){
        client.commands.set(command.data.name, command)
    }else{
        console.log(`Esse comando em ${filePath} está com "data" ou "execute" ausentes`)
    }
}


//Login Bot
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);

//Listener de interações com o bot
client.on(Events.InteractionCreate, async interaction =>{
    if (!interaction.isChatInputCommand()) return
    const command = interaction.client.commands.get(interaction.commandName)
    if (!command){
        console.error('Comando não encontrado')
        return
    }

    try{
        await command.execute(interaction)
    }catch(error){
        console.error(error)
        await interaction.replay('Houve um erro na execução do comando')
    }
})