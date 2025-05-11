const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Provides information about the server.'),
    async execute(interaction) {
		await interaction.reply({ content: 'Message Sent', ephemeral: true });
        const serverEmbed = new EmbedBuilder()
            .setTitle('Server Information')
            .setColor('#05dac0')
            .addFields(
                { name: 'Server Name', value: interaction.guild.name, inline: true },
                { name: 'Total Members', value: interaction.guild.memberCount.toString(), inline: true }
            )
			.setFooter({ text: 'Dev</> alpha07' })
            .setTimestamp();
			await interaction.channel.send({ embeds: [serverEmbed] });
    },
};
