// Prefix:

const { Message, PermissionFlagBits } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
        name: '',
        description: '',
        aliases: [],
        permissions: null,
    },
    /**
     * @param {ExtendedClient} client
     * @param {Message} message
     * @param {[String]} args
     */
    run: async (client, message, args) => {},
};

// Slash:

const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder().setName('').setDescription(''),
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {},
};

// User:

const {
    UserContextMenuCommandInteraction,
    ContextMenuCommandBuilder,
} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new ContextMenuCommandBuilder().setName('').setType(2),
    /**
     * @param {ExtendedClient} client
     * @param {UserContextMenuCommandInteraction} interaction
     */
    run: async (client, interaction) => {},
};

// Message:

const {
    MessageContextMenuCommandInteraction,
    ContextMenuCommandBuilder,
} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new ContextMenuCommandBuilder().setName('').setType(3),
    /**
     * @param {ExtendedClient} client
     * @param {MessageContextMenuCommandInteraction} interaction
     */
    run: async (client, interaction) => {},
};
