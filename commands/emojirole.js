import {any,literal,discordMention,discordEmoji,stringValue,optional} from '../parser/arguments.js';
import {log} from '../util/logger.js';
import Database from '../util/db.js';

export default {
	name: 'emojirole',
	description: 'Setup reaction-based roles for your server!',
	guildOnly:true,
	argTree:any([
		literal('add'),
		literal('remove')
			],discordMention('channel','channel',
				stringValue('message_id',false,
					discordEmoji('emoji',
						optional(discordMention('role','role')))))),
	execute(message, args) {

		const guild = message.guild;
		//console.log(args);

		// Are we adding or removing?
		const adding = !!args.add;
		const messageId = args.message_id;
		const channelId = args.channel;
		const emoji = args.emoji;

		const roleId = args.role;
		// Manual error check
		if (adding && !roleId) {
			return message.reply('You need to specify a role to use!');
		}
		const role = guild.roles.cache.get(roleId);
		if (role === guild.roles.everyone) {
			return message.reply(`You can't make an emoji role for everyone! Don't be ridiculous`);
		}

		const channel = guild.channels.cache.get(channelId);
		if (!channel || channel.type !== 'GUILD_TEXT') {
			return message.reply('You must specify a text channel!');
		}

		channel.messages.fetch(messageId)
			.then(msg => {
				if (!msg) {
					return message.reply('Invalid message id!');
				}
				// Set up the role
				setupEmojiRole(adding ? 'add':'remove',channel,msg,emoji,role,guild,message);
			});

	},
	// Now the important part: The actual listener
	listeners:{
		'messageReactionAdd': async(reaction, user) => {
			if (user.bot) return;
			// When a reaction is received, check if the structure is partial
			if (reaction.partial) {
				// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
				try {
					await reaction.fetch();
				} catch (error) {
					log.error('Something went wrong when fetching the message: ', error);
					// Return as `reaction.message.author` may be undefined/null
					return;
				}
			}

			// Ok we're good
			const message = reaction.message;

			const emojirole = getEmojiRole(message,reaction.emoji);
			// Did it exist?
			if (emojirole) {
				// Give the role to the user!
				const role = message.guild.roles.cache.get(emojirole.role);
				const member = message.guild.members.cache.get(user.id.toString());
				if (role && member) {
					member.roles.add(role);
				}
			}
		},
		'messageReactionRemove': async(reaction, user) => {
			if (user.bot) return;
			// When a reaction is received, check if the structure is partial
			if (reaction.partial) {
				// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
				try {
					await reaction.fetch();
				} catch (error) {
					console.error('Something went wrong when fetching the message: ', error);
					// Return as `reaction.message.author` may be undefined/null
					return;
				}
			}
			const message = reaction.message;
			const emojirole = getEmojiRole(message,reaction.emoji);
			// Did it exist?
			if (emojirole) {
				// Remove the role from the user
				const role = message.guild.roles.cache.get(emojirole.role);
				const member = message.guild.members.cache.get(user.id.toString());
				if (role && member) {
					member.roles.remove(role);
				}
			}
		}
	}
}

// Ok let's do it
async function setupEmojiRole(action,channel,message,emoji,role,guild,commandMessage) {

	const guildDb = Database.getGuild(guild.id.toString());
	let emojiroles = guildDb.emojiroles;
	if (!emojiroles) {
		emojiroles = [];
		guildDb.emojiroles = emojiroles;
	}

	// Add a new role button
	if (action == 'add') {

		// Make sure it doesn't already exist
		if (getEmojiRole(message,emoji)) {
			return commandMessage.reply('This emoji is already configured for a role!');
		}

		// Store 
		const reactObject = {
			channel:channel.id,
			message:message.id,
			emoji:emoji,
			role:role.id
		};
		emojiroles.push(reactObject);
		Database.scheduleWrite();

		// Actually react
		message.react(emoji.stringValue);

		commandMessage.reply('Created new emoji role!');

		log.info('created new emoji role!');
	
	// Remove a role
	}else if (action == 'remove') {

		// Find a role and remove it
		const react = getEmojiRole(message,emoji);
		if (react) {
			const index = emojiroles.indexOf(react);
			// Remove from array
			if (index > -1) {
				emojiroles.splice(index,1);
			}else{
				log.warn('Issue removing emoji role!');
				return commandMessage.reply('There was an issue removing the role!');
			}
			Database.scheduleWrite();

			// remove the actual react
			const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has('352566617231720468'));
			try {
				for (const reaction of userReactions.values()) {
					await reaction.users.remove(userId);
				}
				commandMessage.reply('Removed emoji role!');
			} catch (error) {
				log.error('Failed to remove reactions.');
			}

		}else{
			return commandMessage.reply('I wasn\'t able to find that emoji role');
		}

	}
}


function getEmojiRole(message,emoji) {
	const guildDb = Database.getGuild(message.guild.id.toString());
	const emojiroles = guildDb.emojiroles || [];

	const channel = message.channel;
	for (let i=0;i<emojiroles.length;i++) {

		const r = emojiroles[i];
		if (r.channel == channel.id.toString()
			&& r.message == message.id.toString()
			&& emoji.toString() === r.emoji.stringValue) {
				return r;
		}

	}
	return null;
}