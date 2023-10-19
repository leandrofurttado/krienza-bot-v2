const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//Converter svg para png
const svg2img = require('svg2img');
const fs = require('fs');

const token = 'live_169dad85e5d5d36075333dff58d85c';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('Informações time específico')
    .addStringOption((option) =>
      option.setName('id').setDescription('Digite o ID do time')
    ),
  async execute(interaction) {
    const args = interaction.options.getString('id');
    if (!args) {
      return interaction.reply('Você precisa fornecer o nome de um time!');
    }

   
    try {
      // Simulando dados de uma API para demonstração
      const response = await axios.get(`https://api.api-futebol.com.br/v1/campeonatos/10/tabela`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      //Armazena id digitado pelo usuario
      const teamID = parseInt(args);

    
      //Armazena dados do json resposta em uma const
      const infoTeam = response.data; // Coloque o objeto em um array

      //Quando a requisção manda para infoteam tudo é realizado
      if(infoTeam){
        //find no id que seleciona o objeto inteiro no qual ele pertence e armazena em timeEcontrado e podemos acessar os dados pertencentes
        const timeEncontrado = infoTeam.find(
            (equipe) => equipe.time.time_id === teamID
          );
          console.log(timeEncontrado)
          
        // Convertendo o SVG para PNG
        svg2img(timeEncontrado.time.escudo, { width: 100, height: 100 }, function (error, buffer) {
          if (error) {
            console.error('Houve um erro ao converter o SVG: ', error);
            return interaction.reply('Houve um erro ao buscar os dados do time.');
          }

          //cria um file com a imagem
          fs.writeFileSync('escudo.png', buffer);

          const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle(`Detalhes do Time`)
            .addFields(
              { name: `Time: `, value: `${timeEncontrado.time.nome_popular}`, inline: true },
              { name: `Sigla:  `, value: `${timeEncontrado.time.sigla}`, inline: true },
              { name: `Vitórias: `, value: `${timeEncontrado.vitorias}`, inline: true },
              { name: `Empates: `, value: `${timeEncontrado.empates}`, inline: true },
              { name: `Derrotas: `, value: `${timeEncontrado.derrotas}`, inline: true },
              { name: `Aproveitamento: `, value: `${timeEncontrado.aproveitamento}`, inline: true },
              { name: `Últimos 5 jogos: `, value: `${timeEncontrado.ultimos_jogos}`, inline: true },

            )
            .setImage('attachment://escudo.png')

          //no interact tem que por a imagem
          interaction.reply({ embeds: [embed], files: ['escudo.png'] });
        });
          
      }


    } catch (error) {
      console.error('Houve um erro ao buscar os dados do time: ', error);
      interaction.reply('Houve um erro ao buscar os dados do time.');
    }
  },
};
