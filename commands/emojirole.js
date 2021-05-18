const { TextChannel } = require("discord.js");
const storage = require("../util/storage");

module.exports = {
	name: 'emojirole',
	aliases: [],
	cooldown: 1,
	description: 'Setup reaction-based roles for your server!',
	args:true,
	usage:'<add|remove> <channel> <message id> <emoji> [role (only required when adding)]',
	guildOnly:false,
	execute(message, args) {

		if (args.length < 4) {
			return message.reply('Improper arguments passed! Check usage for help');
		}

		// Get params
		const guild = message.guild;
		if (!guild.available) {
			return;
		}
		const action = args[0].toLowerCase();

		if (action == 'add' && args.length != 5) {
			return message.reply('Improper arguments passed! Check usage for help');
		}

		// Check for permissions
		const member = guild.members.cache.get(message.author.id);
		if (!(member && member.hasPermission('MANAGE_MESSAGES'))) {
			return message.reply('You do not have permission to use this command!');
		}

		// Get channel
		if (!(args[1].startsWith('<#') && args[1].endsWith('>'))) {
			return message.reply(args[1] + ' is not a valid channel');
		}
		const channel = guild.channels.cache.get(args[1].slice(2,-1));
		if (!channel || channel.type != 'text') {
			message.reply('You must specify a text channel!');
		}

		// Get emoji
		const emoji = args[3];

		// Get role
		let role = null;
		if (args.length == 5) {
			if (!(args[4].startsWith('<@&') && args[4].endsWith('>'))) {
				return message.reply(args[4] + ' is not a valid role');
			}
			role = guild.roles.cache.get(args[4].slice(3,-1));
			if (role == guild.roles.everyone) {
				return message.reply('You can\'t make an emoji role for everyone! Don\'t be ridiculous.');
			}
		}

		// Get message
		channel.messages.fetch(args[2])
			.then(msg => {
				if (!msg) {
					return message.reply('Invalid message ID');
				}
				setupEmojiRole(action,channel,msg,emoji,role,guild,message);
			});

	},
	// Now the important part: The actual listener
	listeners:{
		'messageReactionAdd': async(reaction, user) => {
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
			const emojirole = getEmojiRole(message,reaction.emoji.name);
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
			const emojirole = getEmojiRole(message,reaction.emoji.name);
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
		let reacts = storage.guilddata.get(guild.id.toString(),'emojiroles');
		if (reacts) {
			reacts.push(reactObject);
		}else{
			reacts = [reactObject];
		}
		storage.guilddata.put(guild.id.toString(),'emojiroles',reacts);

		// Actually react
		message.react(emoji);

		commandMessage.reply('Created new emoji role!');

		console.log('created new emoji role!');
	
	// Remove a role
	}else if (action == 'remove') {

		// Find a role and remove it
		const react = getEmojiRole(message,emoji);
		if (react) {
			let reacts = storage.guilddata.get(guild.id.toString(),'emojiroles');
			const index = reacts.indexOf(react);
			// Remove from array
			if (index > -1) {
				reacts.splice(index,1);
			}else{
				return commandMessage.reply('There was an issue removing the role!');
			}
			storage.guilddata.put(guild.id.toString(),'emojiroles',reacts);

			// remove the actual react
			const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has('352566617231720468'));
			try {
				for (const reaction of userReactions.values()) {
					await reaction.users.remove(userId);
				}
				commandMessage.reply('Removed emoji role!');
			} catch (error) {
				console.error('Failed to remove reactions.');
			}

		}else{
			return commandMessage.reply('I wasn\'t able to find that emoji role');
		}

	}

}

// Check if this specific emoji role already exists
function getEmojiRole(message,emoji) {
	const reacts = storage.guilddata.get(message.guild.id.toString(),'emojiroles');
	if (reacts) {
		const channel = message.channel;
		for (let i=0;i<reacts.length;i++) {

			const r = reacts[i];
			if (r.channel == channel.id.toString()
				&& r.message == message.id.toString()
				&& r.emoji == emoji) {
					return r;
			}

		}
	}
	return null;
}