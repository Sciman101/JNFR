import { any, discordMention, literal, optional } from '../parser/arguments.js';
import Database, { db } from '../util/db.js';
import Babbler from '../util/babbler.js';
import { Permissions } from 'discord.js';

const regex_matchers = [
    {
        regex: /among\s*us/gi,
        babblerString: 'amongus'
    },
    {
        regex: /h[ _-]*[o0][ _-]*m[ _-]*[e3*][ _-]*[s5][ _-]*[t+][ _-]*[u*][ _-]*c[ _-]*k/gi,
        babblerString: 'homestuck'
    }
];

export default {
    name: 'chatter',
    aliases: [],
    description: 'Enable/Disable random messages from me now and then (disabled by default)',
    argTree: any([
            literal('enable'),
            literal('check'),
            literal('disable')
        ],
        optional(any([
            literal('all'),
            discordMention('channel', 'channel')
        ]))),
    permissions: [Permissions.FLAGS.MANAGE_MESSAGES],
    guildOnly: true,
    execute(message, args) {

        // Identify channel
        const guildId = message.guild.id.toString();
        const guildData = Database.getGuild(guildId);
        guildData.chatterChannels = guildData.chatterChannels || [];

        let enabled = args.enable;
        if (args.check) {
            return message.reply(`This channel is ${guildData.chatterChannels.indexOf(message.channel.id.toString()) === -1 ? 'disabled' : 'enabled'}`);
        }

        let target = message.channel.id.toString();
        if (args.channel) {
            target = args.channel;
        } else if (args.all) {
            target = 'all';
        }

        if (target === 'all') {
            // Enable/disable all
            if (!enabled) {
                guildData.chatterChannels = [];
            } else {
                message.guild.channels.cache.forEach((channel, key) => {
                    const id = channel.id.toString();
                    if (guildData.chatterChannels.indexOf(id) === -1 && channel.type === 'GUILD_TEXT') {
                        guildData.chatterChannels.push(id);
                    }
                });
            }
        } else {
            // Find a specific channel
            if (enabled) {
                guildData.chatterChannels.push(target);
            } else {
                const index = guildData.chatterChannels.indexOf(target);
                if (index != -1) {
                    guildData.chatterChannels.splice(index, 1);
                } else {
                    return message.reply('That channel isn\'t enabled!');
                }
            }
        }

        Database.scheduleWrite();
        const channelString = `<#${target}>`;
        return message.reply(`${enabled ? 'Enabled' : 'Disabled'} chatter messages in ${target === 'all' ? 'all channels' : channelString}!`);
    },
    listeners: {
        'messageCreate': function(message) {

            // Ignore certain messagesst
            if (message.author.bot || message.content.startsWith(message.client.prefix)) return;

            // Make sure it's in an enabled channel
            const channelIds = Database.getGuild(message.guild.id.toString()).chatterChannels || [];
            // We can only send it in certain channels
            if (!channelIds || channelIds.indexOf(message.channel.id.toString()) == -1) return;

            // mention
            if (message.content.indexOf('<@352566617231720468>') !== -1) {
                return message.channel.send(Babbler.get('mention'));
            }

            // Misinformation
            if (Math.random() < 0.001) {
                return message.channel.send(':warning: The above post may contain misinformation :warning:');
            }

            // user was
            if (Math.random() < 0.00075) {
                return message.channel.send(`User was ${Babbler.get('user_msg')} for this post`);
            }

            // Regex
            regex_matchers.forEach(matcher => {
                const matches = message.content.matchAll(matcher.regex);
                for (const match of matches) {
                    const number = parseInt(match[1]);
                    if (number != NaN) {
                        return message.channel.send(Babbler.get(matcher.babblerString));
                    }
                } 
            });
        }
    }
}