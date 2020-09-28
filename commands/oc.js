const fs = require('fs');
let characterData = [];
try {
	const rawData = fs.readFileSync('data/characters.json');
	characterData = JSON.parse(rawData);
	console.log('Loaded characters');
	console.log(characterData);
}catch (err) {
	console.error('Error loading characters!');
}

function writeToFile() {
	fs.writeFileSync('data/characters.json',JSON.stringify(characterData));
	console.log('Updated character data file');
}


module.exports = {
	name: 'oc',
	cooldown: 3,
	description: 'Lets you create, manage, and battle OCs',
	aliases: ['character'],
	usage:'<create/delete/list> -OR- <character id to view>',
	guildOnly:false,
	args:true,
	execute(message, args) {
		
		const action = args[0];
		
		if (action === 'create') {
			// Make a new OC!
			// j!oc create name
			if (args.length < 2) {
				return message.reply('I need a name for this new character');
			}
			const ocName = args[1].replace('#','');
			// Find a tag that isn't taken
			let tag = "000";
			do {
				tag = Math.floor(Math.random()*1000).toString();
				if (tag.length == 1) tag = "0"+tag;
				else if (tag.length == 2) tag = "00"+tag;
			}while (characterData.find(oc => oc.tag == tag));
			
			// Write oc to list
			const oc = {
				name:ocName,
				tag:tag,
				creator:message.author.id.toString(),
				level:1
			};
			characterData.push(oc);
			writeToFile();
			
			message.reply(`Successfully created a new character, ${ocName}#${tag}! They will start at level 1`);
		}else if (action == 'delete') {
			// Delete an oc
			if (args.length < 2) {
				return message.reply('You must specify a character to delete');
			}
			// Find the character in question
			const ocInfo = args[1].split('#');
			const characterIndex = characterData.findIndex(oc => oc && oc.name === ocInfo[0] && oc.tag === ocInfo[1]);
			if (characterIndex == -1) {
				return message.reply(`That character doesn't exist!`);
			}
			const character = characterData[characterIndex];
			
			// Make sure it's ours
			if (character.creator != message.author.id) {
				return message.reply('You can\'t delete someone else\'s character! >:(');
			}
			
			// Verify
			if (args.length < 3) {
				return message.reply(`Are you sure? There\'s no getting them back after this - type \`\`${message.content} confirm\`\` to proceed`);
			}else if (args[2] === 'confirm') {
				characterData.splice(characterIndex,1);
				writeToFile();
				return message.reply(`Character deleted`);
			}else{
				return message.reply(`Wrong confirmation phrase - it's \`\`confirm\`\``);
			}
		
		}else if (action === 'list') {
			
			// List all OCs
			const data = [];
			data.push('All characters:');
			data.push(characterData.map(character => `${character.name}#${character.tag} (Lv.${character.level})`).join('\n'));
			
			return message.author.send(data, {split: true})
				.then(() => {
					if (message.channel.type == 'dm') return;
					message.reply('I DM\'d you a list of characters!');
				}).catch(error => {
					console.error(`Couldn\'t send character list to ${message.author.tag}.\n`, error);
					message.reply('Couldn\'t DM you for some reason? Do you have DMs disabled?');
				});
			
		}else{
			
			// Try and find character
			const ocInfo = args[0].split('#');
			if (ocInfo.length < 2) {
				return message.reply(`Invalid character tag`);
			}
			const character = characterData.find(oc => oc && oc.name === ocInfo[0] && oc.tag === ocInfo[1]);
			if (!character) {
				return message.reply(`That character doesn't exist!`);
			}
			
			// Get creator name
			message.client.users.fetch(character.creator).then(user => {
				
				// Actually show the character!
				const data = [];
				data.push(`***${character.name}***`);
				data.push(`*Created by ${user.username}*`);
				data.push(`Level ${character.level}`);
				
				message.channel.send(data, {split:true});
				
			}).catch(error => {
				console.error(`Couldn\'t find the creator of ${character.name}#${character.tag}`, error);
				message.reply('Problem loading that character D:');
			});
			
			
			
		}
		
	}
}