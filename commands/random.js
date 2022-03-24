module.exports = {
	name: 'random',
	aliases: ['rand'],
	cooldown: 1,
	description: 'Generate a random number, or randomize a sequence',
	args:true,
	usage:'[min] <max> OR <item1> <item2> [item3] ...>',
	guildOnly:false,
	execute(message, args) {
		// Figure out what we're doing
		const numA = parseInt(args[0]);
		const numB = args.length > 1 ? parseInt(args[1]) : NaN;
		if (!isNaN(numA) && (!isNaN(numB) || args.length == 1) && args.length < 3) {
			// Number mode
			const min = isNaN(numB) ? 1 : numA;
			const max = !isNaN(numB) ? numB : numA;

			if (max < min) {
				return message.reply("Max value has to be less than the minimum!");
			}

			const roll = Math.floor(Math.random() * (max-min+1) + min);

			return message.reply(`I picked a random number between \`${min}\` and \`${max}\` and got \`${roll}\`!`);
		}else{

			if (args.length < 2) {
				return message.reply("I need at least 2 things to shuffle!");
			}
			// Shuffle
			for (let i=0;i<args.length;i++) {
				const index = Math.floor(Math.random() * args.length);
				const tmp = args[i];
				args[i] = args[index];
				args[index] = tmp;
			}
			
			let resultString = "Randomized sequence: `";
			for (let i=0;i<args.length;i++) {
				resultString += args[i];
				if (i != args.length-1) {
					resultString += ", ";
				}
			}

			return message.reply(resultString+"`");

		}
	}
}