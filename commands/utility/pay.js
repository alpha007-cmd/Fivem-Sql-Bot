const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logChannelId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Payment Details For Premium!'),
    async execute(interaction) {
        await interaction.reply({ content: 'Message Sent', ephemeral: true });

        const embed = {
            color: 0x0099ff,
            title: '__PAYMENT DETAILS__',
            fields: [
                { name: 'UPI ID', value: '```yohanvarghese123-1@okhdfcbank```' },
                { name: 'Account Number', value: '```77770127162721```' },
                { name: 'IFSC', value: '```FDRL0007777```' },
                { name: 'Bank', value: '```Federal Bank```' },
                { name: 'Account Holder', value: '```Yohan Varghese Geo```' }
            ],
            image: {
                url: 'https://i.imgur.com/iz3Mlac.png'
            }
        };

        await interaction.channel.send({ embeds: [embed] });

        // Log the command usage
        const logEmbed = new EmbedBuilder()
            .setTitle(`${interaction.user.tag} executed a command`)
            .setColor('#05dac0')
            .addFields(
                { name: 'Command', value: `/pay`, inline: true },
                { name: 'User', value: `<@${interaction.user.id}>`, inline: true },
                { name: 'Channel', value: `<#${interaction.channel.id}> (${interaction.channel.name})`, inline: true }
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
    },
};
