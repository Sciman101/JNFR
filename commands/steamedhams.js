import {any,literal,discordMention} from '../parser/arguments.js';
import Database, {db} from '../util/db.js';
import Babbler from '../util/babbler.js';
import fs from 'fs';

let script = [];
fs.readFile('data/steamed_hams.txt','utf8',(err,data) => {
	if (err) throw err;
	data.split('\n').forEach(item => {
		item = item.trim();
		if (item.indexOf('|') == -1) {
			script.push(item);
		}else{
			script.push(item.split('|'));
		}
	});
});


export default {
	name: 'steamedhams',
	aliases: ['steamedclams,mouthewateringhamburgers'],
	description: 'Configure a channel for steamed hams',
	guildOnly:true,
	argTree:any([
		literal('stats'),
		literal('disable'),
		discordMention('channel','channel')
	]),
	execute(message, args) {

		const guild = Database.getGuild(message.guild.id.toString());
		guild.steamedhams ||= {
			enabled: false,
			channelId: null,
			lastSenderId: null,
			index: 0,
			record: 0,
			wins: 0,
			fails: {}
		}

		if (args.stats) {

			const hams= guild.steamedhams;

			let totalFails = 0;
			let sorted = [];
			for (let key in hams.fails) {
				const v = hams.fails[key];
				totalFails += v;
				sorted.push({type:key==="double"?key:"index",index:parseInt(key),count:v});
			}
			sorted.sort((a,b) => b.count - a.count);

			const statsMessage = `
**Steamed Ham Statistics for '${message.guild.name}':**
*Most Words: * ${hams.record || 0}
*Wins: * ${hams.wins || 0}
*Fails: * ${totalFails || 0}
${sorted.slice(0,10).map((item,idx) => `   ${idx+1}) ${item.type == "double" ? "Doubled Word" : '"'+script[item.index]+'"'} - ${item.count}`).join("\n")}
			`;

			return message.reply(statsMessage);

		}else {
			const member = message.guild.members.cache.get(message.author.id);
			if (!member || !member.permissions.has('MANAGE_MESSAGES')) {
				return message.reply(Babbler.get('lacking_permissions'));
			}
		}

		if (args.disable) {
			guild.steamedhams.enabled = false;
			guild.steamedhams.index = 0;
			Database.scheduleWrite();
			return message.reply('Steamed hams disabled. Score information preserved');
		}else{
			const channel = args.channel;
			guild.steamedhams.channelId = channel;
			guild.steamedhams.enabled = true;
			Database.scheduleWrite();
			return message.reply(`Steamed hams enabled, at this time of day, in this server, localized entierly within <#${channel}>`);
		}
	},
	listeners:{
		'messageCreate':function(message) {
			// Ignore certain messages
			if (message.author.bot || message.content.startsWith('j!')) return;

			const guild = Database.getGuild(message.guild.id.toString());
			if (!guild.steamedhams) return;
			const hams = guild.steamedhams;

			if (message.channel.id.toString() === hams.channelId) {

				// Strip message content
				// Ignore messages in parehtnasees
				if (message.cleanContent.startsWith('(')) return;
				const content = message.cleanContent.toLowerCase().trim().replace(/[\W_]/g,"");

				// Compare to the next line in the script
				const nextWord = script[hams.index];

				const comparison = (nextWord instanceof Array && nextWord.indexOf(content) !== -1) || (nextWord === content);
				let oldIndex = hams.index;

				if (!comparison) {
					// Oops
					if (hams.index > 0) {
						hams.index = 0;
						hams.lastSenderId = null;
						hams.fails = hams.fails || {};
						hams.fails[oldIndex] = (hams.fails[oldIndex] || 0) + 1;
						hams.record = oldIndex+1;
						Database.scheduleWrite();
						return message.channel.send(`Ah egads!! The chain is ruined!! <@${message.author.id.toString()}> ruined it ${oldIndex} word(s) in.\nThe next word was \`${nextWord}\`. You've messed up on this word \`${hams.fails[oldIndex]}\` time(s).`);
					}
				}else{
					// Check for someone sending 2 messages in a roe
					if (hams.lastSenderId === message.author.id.toString() && hams.index > 0) {
						hams.index = 0;
						hams.lastSenderId = null;
						hams.fails = hams.fails || {};
						hams.fails.double = (hams.fails.double || 0) + 1;
						hams.record = oldIndex+1;
						Database.scheduleWrite();
						return message.channel.send(`Ah egads!! The chain is ruined!! <@${message.author.id.toString()}> ruined it ${oldIndex} word(s) in.\nYou cannot put a word twice in a row. You've messed up this way \`${hams.fails.double}\` time(s).`);
					}
					
					// Increment index
					hams.index += 1;
					hams.lastSenderId = message.author.id.toString();
					Database.scheduleWrite();

					if (hams.index >= script.length) {
						hams.index = 0;
						hams.wins += 1;
						hams.lastSenderId = null;
						Database.scheduleWrite();

						return message.channel.send(`You group are an odd one, but I must say, you steam a good ham. You made it to the end!\nWins: ${hams.wins}`);

					}else{
						message.react('🍔');
					}
				}

				Database.scheduleWrite();
			}

		}
	}
}