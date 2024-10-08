const { StringSelectMenuInteraction, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const viewApplications = require('../../commands/slash/Developers/view-applications');
const { log } = require('../../functions');
const notificationHandler = require('../../handlers/notifications');

module.exports = {
    customId: 'application-action',
    options: {
        developers: true,
    },
    /**
     *
     * @param {ExtendedClient} client
     * @param {StringSelectMenuInteraction} interaction
     */
    run: async (client, interaction) => {
        const value = interaction.values[0];
        const discordId = interaction?.customId?.split('_')[1];
        const skipIds = client.runtimeVariables.applicationSkips;

        switch (value) {
            case 'skip':
                //skip for later review
                client.runtimeVariables.applicationSkips.push(discordId);
                viewApplications.run(client, interaction, true);
                break;
            case 'decline':
                //decline the application
                client.runtimeVariables.db.collection('users').updateOne(
                    {
                        discordId,
                    },
                    {
                        $set: {
                            applicationStatus: 0,
                        },
                    }
                );
                notificationHandler.notifyUser(
                    client,
                    discordId,
                    'applicationDeclined'
                );
                interaction.guild.members.fetch(discordId).then((member) => {
                    member.roles.remove(client.config.roles.pending);
                });
                viewApplications.run(client, interaction, true);
                break;
            default:
                if (value) {
                    client.runtimeVariables.db.collection('users').updateOne(
                        {
                            discordId,
                        },
                        {
                            $set: {
                                applicationStatus: 2,
                                division: value,
                            },
                        }
                    );
                    interaction.guild.members
                        .fetch(discordId)
                        .then((member) => {
                            member.roles.remove(client.config.roles.pending);
                        });
                    //if (!client.config.development.enabled)
                    notificationHandler.notifyUser(
                        client,
                        discordId,
                        'applicationAccepted',
                        {
                            division: value,
                        }
                    );
                    //give role
                    const member =
                        (await interaction.guild.members.cache.find(
                            (m) => m.id == discordId
                        )) ??
                        (await interaction.guild.members.fetch(discordId));
                    /*const roleId = client.config.roles.divisions[value];
                    const role =
                        (await interaction.guild.roles.cache.find(
                            (r) => r.id == roleId
                        )) ?? (await interaction.guild.roles.fetch(roleId));*/

                    member.roles.remove(client.config.roles.pending);
                    member.roles.add(client.config.roles.divisions[value]);

                    viewApplications.run(client, interaction, true);
                }
                break;
        }
    },
};
