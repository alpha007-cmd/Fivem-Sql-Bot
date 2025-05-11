const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { logChannelId } = require('../../config.json'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update-avatar')
        .setDescription('Update an avatar for your bot')
        .addAttachmentOption(option =>
            option.setName('avatar')
                .setDescription('The avatar to update')
                .setRequired(true)),

    async execute(interaction) {
        const client = interaction.client;
        const avatar = interaction.options.getAttachment('avatar');
        const validFormats = ['image/gif', 'image/png'];
        await interaction.reply({ content: 'Message Sent', ephemeral: true });

        if (!validFormats.includes(avatar.contentType)) {
            try {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setDescription('⚠️ Please use a GIF for an animated avatar or a PNG for a static avatar.');
                
                await interaction.channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Failed to send message:', error);
            }
            await logCommand(interaction, 'Invalid format');
            return;
        }

        if (!client.user) {
            try {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setDescription('⚠️ The bot is not properly initialized.');
                
                await interaction.channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Failed to send message:', error);
            }
            await logCommand(interaction, 'Bot initialization error');
            return;
        }

        try {
            await client.user.setAvatar(avatar.url);
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setDescription('🌍 Uploaded your avatar.');
            
            await interaction.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error('Failed to set avatar:', err);
            try {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setDescription(`⚠️ Error: \`${err.toString()}\``);
                
                await interaction.channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Failed to send error message:', error);
            }
            await logCommand(interaction, `Failed to set avatar: ${err.toString()}`);
        }
        await logCommand(interaction, 'Avatar set successfully');
    }
};
async function logCommand(interaction, status) {
    try {
        const logEmbed = new EmbedBuilder()
            .setTitle(`${interaction.user.tag} executed a command`)
            .setColor('#05dac0')
            .addFields(
                { name: 'Command', value: '/avatar-anim', inline: true },
                { name: 'User', value: `<@${interaction.user.id}>`, inline: true },
                { name: 'Channel', value: `<#${interaction.channel.id}> (${interaction.channel.name})`, inline: true },
                { name: 'Status', value: status, inline: true }
            )
            .setFooter({ text: 'Dev</> alpha07' })
            .setTimestamp();

        const logChannel = await interaction.client.channels.fetch(logChannelId);
        if (logChannel) {
            await logChannel.send({ embeds: [logEmbed] });
        } else {
            console.error(`Log channel with ID ${logChannelId} not found.`);
        }
    } catch (error) {
        console.error('Failed to log command execution:', error);
    }
}
