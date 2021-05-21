const Discord = require('discord.js');
// Load splash messages
const strings = require('../data/strings.json');

const jollarCache = new Discord.Collection(); 

module.exports = {

	// Helper to run a splash message
	get(key,params) {
		const responses = splash[key];
		let msg = responses[Math.floor(Math.random() * responses.length)];
		if (params) {
			for (const p in params) {
				msg = msg.replace(p,params[p]);
			}
		}
		return msg;
	},
	getJollarSign(guild) {
		const id = guild.id.toString();
		let emojiText = jollarCache.get(id);
		if (!emojiText) {
			const emoji = guild.emojis.cache.find(emoji => emoji.name == 'jollar');

			if (!emoji) {
				emojiText = 'Jollar(s)';
			}else{
				emojiText = `<:jollar:${emoji.id}>`;
			}

			jollarCache.set(id,emojiText);
		}
		return emojiText;
	}

}