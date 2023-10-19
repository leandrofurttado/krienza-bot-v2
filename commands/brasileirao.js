const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const token = 'live_169dad85e5d5d36075333dff58d85c';

async function TabelaBR() {
    try {
        const response = await axios.get(`https://api.api-futebol.com.br/v1/campeonatos/10/tabela`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.data) {
            const Tabela = response.data;
            return Tabela;
        }

        console.log('Resposta da API:', response.data);
    } catch (error) {
        // Lidar com erros aqui
        console.error('Erro ao fazer a solicitação:', error);
    }
}




async function LogoBR() {
    try {
        const response = await axios.get(`https://api.api-futebol.com.br/v1/campeonatos/10`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.data) {
            const Logo = response.data;
            return Logo;
        }

        console.log('Resposta da API:', response.data);
    } catch (error) {
        // Lidar com erros aqui
        console.error('Erro ao fazer a solicitação:', error);
    }
}

async function createEmbed() {
    try {
        const times = await TabelaBR();
        const imgLogoBR = await LogoBR()

        const tabelaEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Campeonato Brasileiro')
            .setThumbnail(`${imgLogoBR.logo}`)
            

        times.map((time) => {
            tabelaEmbed.addFields(
                { name: `${time.posicao}ª Colocação`, value: `${time.time.nome_popular} - ${time.pontos}pts / ID_CLUBE: ${time.time.time_id}` }
            );
        });



        const idProcurado = '22'; // ID que você está procurando

        const timeEncontrado = times.find(item => item.time.time_id === idProcurado);
        
        if (timeEncontrado) {
            const { nome_popular } = timeEncontrado.time;
            const { vitorias, derrotas } = timeEncontrado;
        
            console.log(timeEncontrado)
            console.log(timeEncontrado.time.nome_popular)
        } else {
            console.log('Time não encontrado');
        }



        return tabelaEmbed;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('brasileirao')
        .setDescription('Veja a Tabela do Campeonato Brasileiro'),

    async execute(interaction) {
        const embed = await createEmbed();
        await interaction.reply({ embeds: [embed] });
    }
};
