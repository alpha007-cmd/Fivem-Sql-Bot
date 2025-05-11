const { SlashCommandBuilder } = require('@discordjs/builders');
const { pool } = require('../../database.js');
const { db_database } = require('../../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('showdb')
        .setDescription('Show the Full Database Tables'),

    async execute(interaction) {
        try {
            await interaction.reply({ content: 'Fetching database details...', ephemeral: true });

            const conn = await pool.getConnection();
            const result = await conn.query("SHOW TABLES");
            conn.release();

            if (result.length > 0) {
                const tableList = result.map(row => row[`Tables_in_${db_database}`]);
                const tablesMessage = `Tables in the database: ${tableList.join(', \n')}`;

                const embed = new EmbedBuilder()
                    .setTitle('Database Tables')
                    .setDescription(tablesMessage)
                    .setColor('#0099ff');
                interaction.channel.send({ embeds: [embed] });
            } else {
                interaction.followUp('No tables found in the database.');
            }
        } catch (err) {
            console.error('Error executing SQL:', err);
            interaction.followUp({ content: 'An error occurred while fetching tables from the database.', ephemeral: true });
        }
    },
};
