const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { pool } = require('../../database.js');
const { logChannelId } = require('../../config.json'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setname')
        .setDescription('Update user ingame name for a specific identifier in server Database.')
        .addStringOption(option =>
            option.setName('identifier')
                .setDescription('Specify the identifier')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('firstname')
                .setDescription('Specify the new first name')
        )
        .addStringOption(option =>
            option.setName('lastname')
                .setDescription('Specify the new last name')
        ),

    async execute(interaction) {
        try {
            const identifier = interaction.options.getString('identifier');
            const newFirstName = interaction.options.getString('firstname');
            const newLastName = interaction.options.getString('lastname');
        
            await interaction.deferReply({ ephemeral: false });
        
            const updateQuery = `UPDATE users SET firstname = ?, lastname = ? WHERE identifier = ?`;
            const conn = await pool.getConnection();
            await conn.query(updateQuery, [newFirstName, newLastName, identifier]);
            conn.release();
        
            await interaction.followUp(`Updated successfully with **First Name: ${newFirstName} - Last Name: ${newLastName}**.`);
        
            const logEmbed = new EmbedBuilder()
                .setTitle('User Information Updated')
                .setColor('#05dac0')
                .addFields(
                    { name: 'Command', value: `/setname`, inline: true },
                    { name: 'User', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Channel', value: `<#${interaction.channel.id}> (${interaction.channel.name})`, inline: true },
                    { name: 'Identifier', value: identifier, inline: true },
                    { name: 'New First Name', value: newFirstName || 'Not provided', inline: true },
                    { name: 'New Last Name', value: newLastName || 'Not provided', inline: true },
                    { name: 'Status', value: 'Success' }
                )
                .setFooter({ text: 'Dev</> alpha07' })
                .setTimestamp();

            try {
                const logChannel = await interaction.client.channels.fetch(logChannelId);
                if (logChannel) {
                    logChannel.send({ embeds: [logEmbed] });
                } else {
                    console.error(`Log channel with ID ${logChannelId} not found.`);
                }
            } catch (error) {
                console.error('Failed to send log message:', error);
            }

        } catch (err) {
            console.error('Error executing SQL:', err);
            await interaction.followUp({ content: 'An error occurred while updating user information.', ephemeral: true });

            const logEmbed = new EmbedBuilder()
                .setTitle('User Information Update Failed')
                .setColor('#FF0000')
                .addFields(
                    { name: 'Command', value: `/setname`, inline: true },
                    { name: 'User', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Channel', value: `<#${interaction.channel.id}> (${interaction.channel.name})`, inline: true },
                    { name: 'Identifier', value: identifier, inline: true },
                    { name: 'New First Name', value: newFirstName || 'Not provided', inline: true },
                    { name: 'New Last Name', value: newLastName || 'Not provided', inline: true },
                    { name: 'Status', value: 'Failed' }
                )
                .setFooter({ text: 'Dev</> alpha07' })
                .setTimestamp();

            try {
                const logChannel = await interaction.client.channels.fetch(logChannelId);
                if (logChannel) {
                    logChannel.send({ embeds: [logEmbed] });
                } else {
                    console.error(`Log channel with ID ${logChannelId} not found.`);
                }
            } catch (error) {
                console.error('Failed to send log message:', error);
            }
        }
    },
};
