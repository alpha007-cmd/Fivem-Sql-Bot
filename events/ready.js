const { Events, EmbedBuilder } = require('discord.js');
const { pool } = require('../database'); 
const { clientId, guildId, token, db_host, db_user, db_password, db_database, statusChannelId } = require('../config.json'); 

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log('\x1b[38;5;44m'); //  #05DAC0
        console.log(`
        
        ░██████╗░██████╗░██╗░░░░░  ██████╗░░█████╗░████████╗  ███████╗██╗██╗░░░██╗███████╗███╗░░░███╗
        ██╔════╝██╔═══██╗██║░░░░░  ██╔══██╗██╔══██╗╚══██╔══╝  ██╔════╝██║██║░░░██║██╔════╝████╗░████║
        ╚█████╗░██║██╗██║██║░░░░░  ██████╦╝██║░░██║░░░██║░░░  █████╗░░██║╚██╗░██╔╝█████╗░░██╔████╔██║
        ░╚═══██╗╚██████╔╝██║░░░░░  ██╔══██╗██║░░██║░░░██║░░░  ██╔══╝░░██║░╚████╔╝░██╔══╝░░██║╚██╔╝██║
        ██████╔╝░╚═██╔═╝░███████╗  ██████╦╝╚█████╔╝░░░██║░░░  ██║░░░░░██║░░╚██╔╝░░███████╗██║░╚═╝░██║
        ╚═════╝░░░░╚═╝░░░╚══════╝  ╚═════╝░░╚════╝░░░░╚═╝░░░  ╚═╝░░░░░╚═╝░░░╚═╝░░░╚══════╝╚═╝░░░░░╚═╝
                                                                                     BY : ALPHA07
        `);
        console.log('\x1b[0m'); 

        console.log(`Discord bot is ready!\nLogged in as ${client.user.tag}`);

        let dbStatus = '✅ Connected'; 
        let totalTables = 0;

        try {
            const connection = await pool.getConnection();
            const tablesResult = await connection.query('SHOW TABLES');
            totalTables = tablesResult.length;
            console.log('\x1b[31m'); // Red color for database log
            console.log(`Database connection is ready! Database: ${db_database}`);
            console.log(`Total tables in the database: ${totalTables}`);
            connection.release();
        } catch (error) {
            console.error('Error connecting to the database:', error);
            dbStatus = '❌ Not Connected'; 
        }

        const channel = client.channels.cache.get(statusChannelId);
        if (channel) {
            const embed = new EmbedBuilder()
                .setTitle('🚀 Bot Online')
                .setDescription(`The bot has successfully started!\nLogged in as **${client.user.tag}**.`)
                .addFields(
                    { name: '📡 Database Status', value: dbStatus, inline: true },
                    { name: '🗂️ Total Tables', value: `${totalTables}`, inline: true }
                )
                .setColor('#05DAC0')
                .setTimestamp();

            channel.send({ embeds: [embed] }).catch(console.error);
        } else {
            console.error('Channel not found. Make sure the bot has access.');
        }
    },
};
