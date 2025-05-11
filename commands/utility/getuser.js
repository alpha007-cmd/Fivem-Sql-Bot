const { SlashCommandBuilder } = require('@discordjs/builders');
const { pool } = require('../../database.js');
const { EmbedBuilder } = require('discord.js');
const { logChannelId } = require('../../config.json'); // Make sure your log channel ID is in config.json

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getuser')
        .setDescription('Get updated user information for a specific Player in Server Database')
        .addStringOption(option =>
            option.setName('identifier')
                .setDescription('Specify the identifier')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const identifier = interaction.options.getString('identifier');
            await interaction.deferReply({ ephemeral: false });
            const query = `SELECT firstname, lastname FROM users WHERE identifier = ?`;
            const conn = await pool.getConnection();
            const result = await conn.query(query, [identifier]);
            conn.release();

            if (result.length > 0) {
                const updatedUser = result[0];
                const userEmbed = new EmbedBuilder()
                .setTitle("Updated User Information")
                .setDescription(`Identifier: \`\`\`${identifier}\`\`\``) 
                .setColor('#0099ff')
                .addFields(
                    { name: 'First Name', value: updatedUser.firstname !== null ? updatedUser.firstname.toString() : 'N/A' },
                    { name: 'Last Name', value: updatedUser.lastname !== null ? updatedUser.lastname.toString() : 'N/A' }
                );
            
                interaction.followUp({ embeds: [userEmbed] });
                // Log the command usage
        const logEmbed = new EmbedBuilder()
        .setTitle(`${interaction.user.tag} executed a command`)
        .setColor('#05dac0')
        .addFields(
            { name: 'Command', value: `/getuser`, inline: true },
            { name: 'User', value: `<@${interaction.user.id}>`, inline: true },
            { name: 'Channel', value: `<#${interaction.channel.id}> (${interaction.channel.name})`, inline: true },
            { name: 'Identifier', value: identifier, inline: false }
            
        )
        .setFooter({ text: 'Dev</> alpha07' })
        .setTimestamp();

    const logChannel = interaction.client.channels.cache.get(logChannelId);
    if (logChannel) {
        logChannel.send({ embeds: [logEmbed] });
    }
            } else {
                const noUserEmbed = new EmbedBuilder()
                    .setTitle("User Not Found")
                    .setDescription(`No user found with identifier ${identifier}.`)
                    .setColor('#ff0000');

                interaction.followUp({ embeds: [noUserEmbed] });
            }
        } catch (err) {
            console.error('Error executing SQL:', err);
            const errorEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription('An error occurred while fetching updated user information.')
                .setColor('#ff0000');

            interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
        }
        
    },
};
