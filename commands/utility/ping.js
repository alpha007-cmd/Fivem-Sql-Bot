const { SlashCommandBuilder } = require('discord.js');

const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check if the bot is responding'),
	async execute(interaction) {
		try {
			await interaction.reply('Up and Running');
			await wait(100); 
						const message = await interaction.fetchReply();
		} catch (error) {
			console.error('Error handling interaction:', error);
		}
	},
};
