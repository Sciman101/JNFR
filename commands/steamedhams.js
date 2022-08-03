import {any,literal,discordMention} from '../parser/arguments.js';
import Database, {db} from '../util/db.js';
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
	permissions:['MANAGE_MESSAGES'],
	guildOnly:true,
	argTree:any([
		literal('disable'),
		discordMention('channel','channel')
	]),
	execute(message, args) {

		let guild = Database.getGuild(message.guild.id.toString());
		if (!guild.steamedhams) {
			guild.steamedhams = {
				enabled: false,
				channelId: null,
				lastSenderId: null,
				index: 0,
				wins: 0,
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
				const content = message.cleanContent.toLowerCase().trim().replace(/[.,\/#!?"[\]\@$%\^&\*;:{}=\-_`'~()]/g,"");

				// Compare to the next line in the script
				const nextWord = script[hams.index];

				const comparison = (nextWord instanceof Array && nextWord.indexOf(content) !== -1) || (nextWord === content);
				let oldIndex = hams.index;

				if (!comparison) {
					// Oops
					if (hams.index > 0) {
						hams.index = 0;
						hams.lastSenderId = null;
						Database.scheduleWrite();
						return message.channel.send(`Ah egads!! The chain is ruined!! <@${message.author.id.toString()}> ruined it ${oldIndex} word(s) in.\nThe next word was \`${nextWord}\`.`);
					}
				}else{
					// Check for someone sending 2 messages in a roe
					if (hams.lastSenderId === message.author.id.toString() && hams.index > 0) {
						hams.index = 0;
						hams.lastSenderId = null;
						Database.scheduleWrite();
						return message.channel.send(`Ah egads!! The chain is ruined!! <@${message.author.id.toString()}> ruined it ${oldIndex} word(s) in.\nYou cannot put a word twice in a row.`);
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