const LETTER_EMOJI = '🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮 🇯 🇰 🇱 🇲 🇳 🇴 🇵 🇶 🇷 🇸 🇹 🇺 🇻 🇼 🇽 🇾 🇿'.split(' ');

module.exports = {
	name: 'poll',
	aliases: [],
	cooldown: 1,
	description: 'Set up a poll for people to vote on! Earn jCoin for being on the winning side',
	args:true,
	usage:'<duration> <option 1> <option 2> [option 3] [etc...]',
	guildOnly:false,
	execute(message, args) {
		if (args.length < 3) {
			return message.reply('You need to specify a duration for the poll, and at least 2 options!');
		}if (args.length > 27) {
			return message.reply(`That's *way* too many options, dude. Try a few less`);
		}

		// figure out options and respective emoji
		const options = args.slice(1);
		const duration = parseInt(args[0]);
		if (!duration || duration < 10) {
			return message.reply("That's not a valid duration! Minimum is 10 seconds");
		}

		const a = '🇦'.charCodeAt(0);
		// Create list of emoji
		const emoji = LETTER_EMOJI.slice(0,options.length);
		const filter = (reaction,user) => {
			return emoji.includes(reaction.name) != -1;
		}

		// Send message
		let prompt = `<@${message.author.id.toString()}> has started a poll that will last ${duration} seconds! Vote with the reactions now!\n`;
		for (let i=0;i<options.length;i++) {
			prompt += `${emoji[i]}) **${options[i]}**\n`;
		}
		message.channel.send(prompt)
			.then(pollMessage => {

				// Delete the original message
				message.delete();

				// Send reacts
				addEmoji(pollMessage,emoji)
					.then(
						pollMessage.awaitReactions(filter, {time: duration * 1000, errors:['time']})
							.then()
							.catch(collected => {
								
								// Now, we need to figure out how many votes everything got
								let winner = null;
								let index = 0;
								let winnerIndex = -1;
								for (let value of collected) {
									if (!winner || value[1].count > winner.count) {
										winner = value[1];
										winnerIndex = index;
									}
									index++;
								}

								// Find all winners in case there's a tie
								let winnerIndices = [];
								index = 0;
								for (let value of collected) {
									if (value[1].count == winner.count) {
										winnerIndices.push(index);
									}
									index++;
								}

								// We now know who won
								let output = `The poll has ended after ${duration} seconds!\n`;
								if (winnerIndices.length == 1) {
									// Single winner
									output += `The winner is ${options[winnerIndex]} with ${winner.count-1} votes! :tada:`;
								}else{
									// Multiple winners
									output += `It's a tie! The winners are `;
									for (let i=0;i<winnerIndices.length;i++) {
										output += `**${options[winnerIndices[i]]}**`;
										if (i == winnerIndices.length-2 && winnerIndices.length > 2) {
											output += ' and ';
										}else if (i != winnerIndices.length-1) {
											output += ', ';
										}
									}
									output += `, with ${winner.count} vote(s) each!`;
								}
								pollMessage.channel.send(output);

							})
						)
				
			}).catch(console.error);
		

	}
}

async function addEmoji(message,emojiList) {
	for (let i=0;i<emojiList.length;i++) {
		await message.react(emojiList[i]);
	}
}