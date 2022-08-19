import { any, discordMention, literal, optional } from '../parser/arguments.js';
import Database, {db} from '../util/db.js';
import Babbler from '../util/babbler.js';

const amongusRegexp = /among\s*us/gi;
const homestuckRegexp = /h[ _-]*[o0][ _-]*m[ _-]*[e3*][ _-]*[s5][ _-]*[t+][ _-]*[u*][ _-]*c[ _-]*k/gi;

export default {
	name: 'chatter',
	aliases: [],
	description: 'Enable/Disable random messages from me now and then (disabled by default)',
	argTree:any([
		literal('enable'),
		literal('check'),
		literal('disable')],
			optional(any([
				literal('all'),
				discordMention('channel','channel')]))),
    permissions:['MANAGE_MESSAGES'],
	guildOnly:true,
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
		}else if (args.all) {
			target = 'all';
		}

        if (target === 'all') {
            // Enable/disable all
            if (!enabled) {
                guildData.chatterChannels = [];
            }else{
                message.guild.channels.cache.forEach((channel,key) => {
					const id = channel.id.toString();
					if (guildData.chatterChannels.indexOf(id) === -1 && channel.type === 'GUILD_TEXT') {
                    	guildData.chatterChannels.push(id);
					}
                });
            }
        }else{
            // Find a specific channel
			if (enabled) {
				guildData.chatterChannels.push(target);
			}else{
				const index = guildData.chatterChannels.indexOf(target);
				if (index != -1) {
					guildData.chatterChannels.splice(index,1);
				}else{
					return message.reply('That channel isn\'t enabled!');
				}
			}
        }

		Database.scheduleWrite();
		const channelString = `<#${target}>`;
        return message.reply(`${enabled ? 'Enabled' : 'Disabled'} chatter messages in ${target === 'all' ? 'all channels' : channelString}!`);
	},
	listeners:{
		'messageCreate':function(message) {

			// Ignore certain messagesst
			if (message.author.bot || message.content.startsWith(message.client.prefix)) return;

            // Make sure it's in an enabled channel
            const channelIds = Database.getGuild(message.guild.id.toString()).chatterChannels || [];
            // We can only send it in certain channels
            if (!channelIds || channelIds.indexOf(message.channel.id.toString()) == -1) return;

            // Misinformation
            if (Math.random() < 0.0025) {
                return message.channel.send(':warning: The above post may contain misinformation :warning:');
            }

            // mention
            if (message.content.indexOf('<@352566617231720468>') !== -1) {
                return message.channel.send(Babbler.get('mention'));
            }

            // Among us
            const matches = message.content.matchAll(amongusRegexp);
            for (const match of matches) {
                const number = parseInt(match[1]);
                if (number != NaN) {
                    return message.channel.send(Babbler.get('amongus'));
                }
            }

			const hsMatches = message.content.toLowerCase().matchAll(homestuckRegexp);
			for (const match of hsMatches) {
				const number = parseInt(match[1]);
                if (number != NaN) {
                    return message.channel.send(Babbler.get('homestuck'));
                }
			}


		}
	}
}