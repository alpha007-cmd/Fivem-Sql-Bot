const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActivityType, EmbedBuilder, ChannelType } = require('discord.js');
const { logChannelId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('presence-update')
        .setDescription('Update the bot rich presence.')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('The status message to set.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of activity (playing, streaming, listening, watching).')
                .setRequired(true)
                .addChoices(
                    { name: 'Playing', value: 'PLAYING' },
                    { name: 'Streaming', value: 'STREAMING' },
                    { name: 'Listening', value: 'LISTENING' },
                    { name: 'Watching', value: 'WATCHING' }
                )),

    async execute(interaction) {
        const status = interaction.options.getString('status');
        const type = interaction.options.getString('type');

        let activityType;
        switch (type) {
            case 'PLAYING':
                activityType = ActivityType.Playing;
                break;
            case 'STREAMING':
                activityType = ActivityType.Streaming;
                break;
            case 'LISTENING':
                activityType = ActivityType.Listening;
                break;
            case 'WATCHING':
                activityType = ActivityType.Watching;
                break;
            default:
                activityType = ActivityType.Playing;
        }

        try {
            await interaction.client.user.setPresence({
                activities: [{ name: status, type: activityType }],
                status: 'online'
            });

            await interaction.reply({
                content: `Rich presence updated to "${status}" as ${type}.`,
                ephemeral: true
            });

            const logEmbed = new EmbedBuilder()
                .setTitle(`${interaction.user.tag} executed a command`)
                .setColor('#05dac0')
                .addFields(
                    { name: 'Command', value: `/presence-update`, inline: true },
                    { name: 'User', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'New Status', value: `"${status}"`, inline: true },
                    { name: 'Activity Type', value: type, inline: true }
                )
                .setFooter({ text: 'Dev</> alpha07' })
                .setTimestamp();

            // Send the log embed
            try {
                const logChannel = await interaction.client.channels.fetch(logChannelId);
                if (logChannel && logChannel.type === ChannelType.GuildText) {
                    await logChannel.send({ embeds: [logEmbed] });
                } else {
                    console.error(`Log channel with ID ${logChannelId} not found or is not a text channel.`);
                }
            } catch (error) {
                console.error('Failed to send log message:', error);
            }

        } catch (error) {
            console.error('Error updating rich presence:', error);
            await interaction.reply({
                content: 'Failed to update rich presence. Please try again later.',
                ephemeral: true
            });
        }
    }
};
