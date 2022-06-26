const storage = require('../util/storage.js');
const {prefix} = require('../config.json');
const Text = require('../util/text.js');

const amongusRegexp = /among\s*us/gi;

module.exports = {
	name: 'chatter',
	aliases: [],
	cooldown: 3,
	description: 'Enable/Disable random messages from me now and then (disabled by default)',
	args:false,
    permissions:['MANAGE_MESSAGES'],
	usage:'<disable/enable> [channel or \'all\']',
	guildOnly:true,
	execute(message, args) {	

        // Identify channel
        const guildId = message.guild.id.toString();
        let chatterChannels = storage.guilddata.get(guildId,'chatterChannels') || [];
        const currentChannelIndex = chatterChannels.indexOf(message.channel.id.toString());

		if (args.length < 1) {
            return message.reply(`Chatter is ${currentChannelIndex !== -1 ? '' : 'not'} enabled in this channel`);
        }
        const enableString = args[0].toLowerCase();
        let enabled = false;
        if (enableString === 'enable') enabled = true;
        else if (enableString === 'disable') enabled = false;
        else return message.reply('Tell me to enable/disable the chatter function')

        const channelString = args.length > 1 ? args[1] : '<#'+message.channel.id.toString()+'>';
        const selectAll = channelString.toLowerCase() === 'all';
        if (selectAll) {
            // Enable/disable all
            if (!enabled) {
                chatterChannels = [];
            }else{
                message.guild.channels.cache.forEach((channel,key) => {
                    chatterChannels.push(channel.id.toString());
                });
            }
        }else{
            // Find a specific channel
            if (channelString.startsWith('<#') && channelString.endsWith('>')) {
                const channelId = channelString.slice(2, -1);
                if (enabled) {
                    chatterChannels.push(channelId);
                }else{
                    if (currentChannelIndex != -1) {
                        chatterChannels.splice(currentChannelIndex,1);
                    }else{
                        return message.reply('That channel isn\'t enabled!');
                    }
                }
            }else{
                return message.reply('Invalid channel!');
            }
        }

        storage.guilddata.put(guildId,'chatterChannels',chatterChannels);
        return message.reply(`${enabled ? 'Enabled' : 'Disabled'} chatter messages in ${selectAll ? 'all channels' : channelString}!`);
	},
	listeners:{
		'message':function(message) {

			// Ignore certain messagesst
			if (message.author.bot || message.content.startsWith(prefix)) return;

            // Make sure it's in an enabled channel
            const channelIds = storage.guilddata.get(message.guild.id.toString(),'chatterChannels');
            // We can only send it in certain channels
            if (!channelIds || channelIds.indexOf(message.channel.id.toString()) == -1) return;

            // Misinformation
            if (Math.random() < 0.0025) {
                return message.channel.send(':warning: The above post may contain misinformation :warning:');
            }

            // mention
            if (message.content.indexOf('<@352566617231720468>') !== -1) {
                return message.channel.send(Text.get('mention'));
            }

            // Among us
            const matches = message.content.matchAll(amongusRegexp);
            for (const match of matches) {
                const number = parseInt(match[1]);
                if (number != NaN) {
                    return message.channel.send(Text.get('amongus'));
                }
            }


		}
	}
}