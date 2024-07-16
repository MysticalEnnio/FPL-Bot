const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const { log } = require('../../functions');
const {
    calculatePoints,
    submitPointData,
} = require('../../handlers/matchCalculations');

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
        await interaction.deferReply();
        const gamemode = interaction.customId.split('_')[1];
        const analysisTimestamp = parseInt(interaction.customId.split('_')[2]);

        const confirmWords = ['yes', 'true', '1', 'ok', 'y', 'ye', 'yeah'];
        const denyWords = ['no', 'false', '0', 'n', 'nah', 'nope'];

        interaction.fields.fields.forEach((field) => {
            log(field, 'debug', true);
            if (
                !confirmWords.includes(field.value) &&
                !denyWords.includes(field.value) //!(parseInt(field.value) && field.value > 0 && field.value < 6)
            ) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Warn')
                            .setDescription(
                                `Please enter a valid response for Team ${
                                    field.customId.split('_')[1]
                                }`
                            )
                            .setColor('Yellow'),
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId(
                                    `match-gamemode_${analysisTimestamp}_${gamemode}`
                                )
                                .setLabel('Try Again')
                                .setStyle('Primary')
                                .setEmoji('🔄')
                        ),
                    ],
                    ephemeral: client.config.development.ephemeral,
                });
            }
        });

        const c_matchAnalysis =
            client.runtimeVariables.db.collection('matchAnalysis');

        log(analysisTimestamp, 'debug', true);

        const matchData = await c_matchAnalysis.findOne({
            timestamp: new Date(analysisTimestamp),
        });

        log(matchData, 'debug', true);

        if (!matchData || !matchData.playerData) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('Match data not found in database')
                        .setColor('Red'),
                ],
                ephemeral: client.config.development.ephemeral,
            });
        }

        const pointData = await calculatePoints(
            new Map(Object.entries(matchData.playerData)),
            interaction.fields.fields.map((field) => {
                if (confirmWords.includes(field.value)) return true;
                if (denyWords.includes(field.value)) return false;
            })
        );

        log(pointData, 'debug', true);

        let playerDocs = new Map();

        c_users = client.runtimeVariables.db.collection('users');

        for await (const embarkId of pointData.keys()) {
            //use case insensitive search
            let userDocs = await c_users
                .find({
                    embarkId: {
                        $regex: new RegExp(
                            `^${
                                embarkId
                                    .split('#')[0]
                                    .replace(/0/g, '(O|0)')
                                    .replace(/(?<!\()(O)/gi, '(O|0)') +
                                '#' +
                                embarkId.split('#')[1]
                            }$`,
                            'i'
                        ),
                    },
                })
                .toArray();

            if (userDocs.length == 0) {
                log(
                    `User with embark ID ${embarkId} not found in the database`,
                    'warn'
                );
                //continue;
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription(
                                `User with embark ID ${embarkId} not found in the database`
                            )
                            .setColor('Red'),
                    ],
                    //button to change embarkId of specific user
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('set-match-embark-id_' + embarkId)
                                .setLabel('Set Embark ID')
                                .setStyle('Primary')
                                .setEmoji('🔄')
                        ),
                    ],
                    ephemeral: client.config.development.ephemeral,
                });
            }
            if (userDocs.length > 1) {
                log(
                    `Multiple users with embark ID ${embarkId} found in the database`,
                    'warn'
                );
                //continue;
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription(
                                `Multiple users with embark ID ${embarkId} found in the database`
                            )
                            .setColor('Red'),
                    ],
                    ephemeral: client.config.development.ephemeral,
                });
            }

            if (userDocs[0].embarkId != embarkId) {
                matchData.playerData[userDocs[0].embarkId] =
                    matchData.playerData[embarkId.toLowerCase()];
                delete matchData.playerData[embarkId.toLowerCase()];
            }
            playerDocs.set(userDocs[0].embarkId, userDocs[0]);
        }

        //log amount of players found
        log(`Found ${playerDocs.size} players in the database`, 'debug', true);

        for await (const embarkId of playerDocs.keys()) {
            const userDoc = playerDocs.get(embarkId);
            const playerPointData = pointData.get(embarkId.toLowerCase());
            const playerData = matchData.playerData[embarkId.toLowerCase()];
            if (!playerData) {
                log(
                    `Player data for user with embark ID ${embarkId} not found in match data`,
                    'warn'
                );
                log(playerData, 'debug');
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription(
                                `Player data for user with embark ID ${embarkId} not found in match data`
                            )
                            .setColor('Red'),
                    ],
                    ephemeral: client.config.development.ephemeral,
                });
            }
            if (!playerPointData) {
                log(
                    `Point data for user with embark ID ${embarkId} not found`,
                    'warn'
                );
                log(playerPointData, 'debug');
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription(
                                `Point data for user with embark ID ${embarkId} not found`
                            )
                            .setColor('Red'),
                    ],
                    ephemeral: client.config.development.ephemeral,
                });
            }
            if (!userDoc) {
                log(
                    `User with embark ID ${embarkId} not found in the database`,
                    'warn'
                );
                log(userDoc, 'debug');
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription(
                                `User with embark ID ${embarkId} not found in the database`
                            )
                            .setColor('Red'),
                    ],
                    ephemeral: client.config.development.ephemeral,
                });
            }
        }
        for await (const embarkId of playerDocs.keys()) {
            const userDoc = playerDocs.get(embarkId);
            const playerPointData = pointData.get(embarkId.toLowerCase());
            const playerData = matchData.playerData[embarkId.toLowerCase()];
            const result = await submitPointData(
                client,
                userDoc,
                playerPointData,
                playerData,
                analysisTimestamp
            );

            if (!result) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription(
                                `An error occurred while submitting point data for user with embark ID ${embarkId}`
                            )
                            .setColor('Red'),
                    ],
                    ephemeral: client.config.development.ephemeral,
                });
            }
        }

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Success')
                    .setDescription('Point data submitted successfully.')
                    .setColor('Green'),
            ],
            ephemeral: client.config.development.ephemeral,
        });
    },
};
