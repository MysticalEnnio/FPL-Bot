const {
    StringSelectMenuInteraction,
    ActionRowBuilder,
    TextInputStyle,
    TextInputBuilder,
    ModalBuilder,
} = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const { log } = require('../../functions');

module.exports = {
    customId: 'match-gamemode',
    options: {
        developers: true,
    },
    /**
     *
     * @param {ExtendedClient} client
     * @param {StringSelectMenuInteraction} interaction
     */
    run: async (client, interaction) => {
        const gameMode =
            interaction.values[0] || interaction.customId.split('_')[2];
        const analysisTimestamp = interaction.customId.split('_')[1];

        const modal = new ModalBuilder()
            .setTitle('Objectives Played')
            .setCustomId(
                `submit-team-ratings_${gameMode}_${analysisTimestamp}`
            );

        for (
            let i = 0;
            i <
            client.config.gamemodes.find((gm) => gm.value == gameMode)?.teams;
            i++
        ) {
            /*modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setLabel(`Team on place ${i + 1}`)
                        .setCustomId(`team-rating_${i + 1}`)
                        .setPlaceholder(
                            'Enter the star rating for this team (1-5)'
                        )
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                )
            );*/
            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setLabel(`Team ${i + 1}`)
                        .setCustomId(`team-rating_${i + 1}`)
                        .setPlaceholder('Did the team play the objective?')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                )
            );
        }

        await interaction.showModal(modal);
    },
};
