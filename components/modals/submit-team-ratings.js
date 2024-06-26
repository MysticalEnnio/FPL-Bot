const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const { log } = require('../../functions');

module.exports = {
    customId: 'submit-team-ratings',
    options: {
        developers: true,
    },
    /**
     *
     * @param {ExtendedClient} client
     * @param {*} interaction
     */
    run: async (client, interaction) => {
        const division = interaction.customId.split('_')[1];
        const gameMode = interaction.customId.split('_')[2];
        const msgId = interaction.customId.split('_')[3];

        interaction.fields.fields.forEach((field) => {
            if (
                !(parseInt(field.value) && field.value > 0 && field.value < 6)
            ) {
                return interaction.reply({
                    content: `Please enter a rating between 1 and 5 for ${field.name}`,
                    ephemeral: client.config.development.ephemeral,
                });
            }
        });

        interaction.message.delete();

        await interaction.reply({
            content: 'Ratings submitted!',
            ephemeral: client.config.development.ephemeral,
        });

        const c_matches = client.runtimeVariables.db.collection('matches');

        const match = await c_matches.findOne({
            msgId: msgId,
        });

        if (!match) {
            return interaction.reply({
                content: 'An error occured. (Match not found)',
                ephemeral: client.config.development.ephemeral,
            });
        }

        if (match.status != 2) {
            return interaction.reply({
                content: 'Match has not ended yet.',
                ephemeral: client.config.development.ephemeral,
            });
        }

        //save the ratings
        c_matches.updateOne(
            {
                msgId: msgId,
            },
            {
                $set: {
                    teamRatings: interaction.fields.fields.map((field) => ({
                        placement: field.customId.split('_')[1],
                        rating: parseInt(field.value),
                    })),
                },
            }
        );

        match.users.forEach((user) => {
            interaction.channel.send({
                content: `Enter data for ${user.name}`,
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId(
                                `enter-match-data_${user.id}_${division}_${gameMode}_${msgId}`
                            )
                            .setLabel('Enter Data')
                            .setStyle('Primary')
                            .setEmoji('📊')
                    ),
                ],
            });
        });
    },
};
