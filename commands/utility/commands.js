const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('Lists all available bot commands'),
    async execute(interaction) {
        const commands = interaction.client.commands.map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description}`).join('\n');
        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('Available Commands')
            .setDescription(commands)
            .setTimestamp()
            .setFooter({ text: 'Dev</> alpha07' });
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
