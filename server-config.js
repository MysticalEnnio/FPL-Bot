module.exports = {
    client: {
        token: process.env.DISCORD_TOKEN,
        id: process.env.DISCORD_CLIENT_ID,
    },
    db: {
        name: 'FPL-Bot-Production',
    },
    handler: {
        prefix: 'fpl_',
        deploy: true,
        commands: {
            prefix: false,
            slash: true,
            user: false,
            message: false,
        },
        mongodb: {
            enabled: true,
            uri: process.env.MONGODB_URI,
        },
        errors: 'owner', // "owner" or "developers"
    },
    users: {
        developers: [
            '738346395416789022',
            '457236806853853185',
            '948229068363530260',
            '290164002997272577',
        ],
        ownerId: '738346395416789022',
    },
    seasons: [
        {
            name: 'Alpha',
            value: 'alpha',
        },
        {
            name: 'Closed Beta 1',
            value: 'cb1',
        },
        {
            name: 'Closed Beta 2',
            value: 'cb2',
        },
        {
            name: 'Open Beta 1',
            value: 'ob1',
        },
        {
            name: 'Season 1',
            value: 's1',
        },
        {
            name: 'Season 2',
            value: 's2',
        },
        {
            name: 'Season 3',
            value: 's3',
        },
    ],
    gamemodes: [
        {
            label: 'CASHOUT',
            value: 'cashout',
            teams: 4,
            winningTeams: [1, 2],
        },
        {
            label: 'TERMINAL ATTACK',
            value: 'terminal-attack',
            teams: 2,
            winningTeams: [1],
        },
        {
            label: 'POWER SHIFT',
            value: 'power-shift',
            teams: 2,
            winningTeams: [1],
        },
        {
            label: 'QUICK CASH',
            value: 'quick-cash',
            teams: 3,
            winningTeams: [1],
        },
        {
            label: 'BANK IT',
            value: 'bank-it',
            teams: 4,
            winningTeams: [1],
        },
    ],

    channels: {
        modLogs: {
            enabled: false,
            channel: '1246810115479310427',
        },
        queue: '1238554085679173733',
        voice: {
            divisions: {
                verified: {
                    'A': '1249766792763543637',
                    'B': '1250118891666018314',
                },
                unverified: {
                    'A': '1250130019448127519',
                },
            },
        },
        leaderboard: '1239671865073471570',
        notifications: {
            application: '1260563756006768732',
            match: '1261039956911063195',
            division: '1261433158184730624',
        },
    },
    categories: {
        'fpl-vcs': '1256304614920294431',
    },
    roles: {
        divisions: {
            'A': '1232453650455203970',
            'B': '1232453803207430144',
        },
        //multipliers will be added to the user's weight (weight+=multiplier-1)
        weightModify: [
            /*{
                id: '1146913497943392418',
                multiplier: 2,
                name: 'Legend (YT)',
            },
            {
                id: '1246568974720962593',
                multiplier: 2,
                name: 'Legend (TTV-T2)',
            },
            {
                id: '1246568974720962594',
                multiplier: 2,
                name: 'Legend (TTV)',
            },
            {
                id: '1146913497100324878',
                multiplier: 2,
                name: 'Champion (YT)',
            },
            {
                id: '1246568974720962592',
                multiplier: 2,
                name: 'Champion (TTV-T1)',
            },*/
        ],
        admin: '1238551023446917221',
        pulled: '1256312860577894550',
        verified: '1256312913799544972',
        pending: '1238551748923232347',
    },
    development: {
        enabled: false,
        ephemeral: true,
        deployToGuild: true,
        logFile: 'log.txt',
        guild: process.env.GUILD_ID,
    },
    messageSettings: {
        nsfwMessage: 'The current channel is not a NSFW channel.',
        ownerMessage:
            'The bot developer has the only permissions to use this command.',
        developerMessageCommand: 'You are not authorized to use this command.',
        developerMessageComponent:
            'You are not authorized to use this component.',
        cooldownMessage:
            "Slow down buddy! You're too fast to use this command ({cooldown}s).", // '{cooldown}' is a variable that shows the time to use the command again (in seconds)
        globalCooldownMessage:
            'Slow down buddy! This command is on a global cooldown ({cooldown}s).', // '{cooldown}' is a variable that shows the time to use the command again (in seconds)
        notHasPermissionMessage:
            'You do not have the permission to use this command.',
        notHasPermissionComponent:
            'You do not have the permission to use this component.',
        missingDevIDsMessage:
            'This is a developer only command, but unable to execute due to missing user IDs in configuration file.',
    },
    divisions: [
        {
            id: 1,
            name: 'Division A',
            shortName: 'A',
        },
        {
            id: 2,
            name: 'Division B',
            shortName: 'B',
        },
    ],
};
