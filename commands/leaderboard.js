const storage = require('../util/storage.js');
const {prefix} = require('../config.json');
const Text = require('../util/text.js');

module.exports = {
	name: 'leaderboard',
	aliases: ['highscores'],
	cooldown: 10,
	description: 'See who has the most Jollars',
	args:false,
	usage:'',
	guildOnly:false,
	execute(message, args) {	
		const users = storage.userdata.users();
		let scores = [];
		for (const id in users) {
			scores.push({id:id,bal:users[id].balance});
		}
		scores.sort((a,b) => b-a);

		let response = 'Leaderboard:\n';
		for (let i=0;i<5;i++) {
			if (i >= scores.length) {
				break;
			}

			response += `#${i+1}: <@${scores[i].id}> - ${scores[i].bal}${Text.getJollarSign(message.guild)}\n`;

		}
		
		message.channel.send(response);
	}
}