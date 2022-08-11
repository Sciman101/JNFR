import {discordMention, stringValue} from '../parser/arguments.js';
import Database, {db} from '../util/db.js';

export default {
	name: 'mutate',
	aliases: ['alter'],
	description: 'Set a user\'s species',
	argTree: discordMention('user','user',stringValue('race')),
	permissions: ['MANAGE_MESSAGES'],
	guildOnly: true,
	execute(message, args) {	
		const userData = Database.getUser(args.user);
		userData.race = args.race;
		return message.reply('User has been turned into a ' + args.race);
	}
}