const { StringSelectMenuInteraction, EmbedBuilder } = require('discord.js');
const { log } = require('../../functions');

module.exports = {
    customId: 'delete-application',
    options: {
        developers: true,
    },
    run: async (client, interaction) => {
        //if selected is yes delete otherwise do nothing
        const value = interaction.values[0];
        const discordId = interaction.customId.split('_')[1];
        if (value == 'yes') {
            client.runtimeVariables.db.collection('users').deleteOne({
                discordId,
            });
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Application Deleted')
                        .setDescription('The application has been deleted.')
                        .setColor('Green'),
                ],
                ephemeral: client.config.development.ephemeral,
            });
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Application Not Deleted')
                        .setDescription('The application has not been deleted.')
                        .setColor('Red'),
                ],
                ephemeral: client.config.development.ephemeral,
            });
        }
    },
};
