//Construtor de slash commands
const {SlashCommandBuilder} = require('discord.js');

//para exportar o comando
module.exports = {
data: new SlashCommandBuilder()
//Comando utilizado
    .setName('ping')
    .setDescription('Responde com Pong!'),

    //Na hora que for chamado a interação vai responder
    async execute(interaction){
        await interaction.reply('Pong!')
    }
}