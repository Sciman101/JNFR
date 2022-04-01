const { Collection } = require("discord.js");

function randomItem(arr) {
	return arr[Math.floor(Math.random()*arr.length)];
}

module.exports = {
	name: 'markov',
	aliases: ['ramble'],
	cooldown: 1,
	description: 'Generate a random message',
	args:false,
	usage:'[length]',
	guildOnly:false,
	execute(message, args) {
		let length = NaN;
		if (args.length > 0) {
			length = parseInt(args[0]);
		}
		if (isNaN(length)) {
			length = 50;
		}

		// Generate list
		message.channel.messages.fetch({limit:100}).then(messages => {

			let text = "";
			messages.forEach(msg => {
				if (!msg.content.startsWith('j!') && msg.author.toString() != '352566617231720468') {
					text += msg.cleanContent + " ";
				}
			});
			//console.log(data);
			textArray = text.replace('\n',' ').split(' ');
			// Build frequency table
			data = new Collection();
			for (let i=0;i<textArray.length-1;i++) {
				const text = textArray[i];
				let set = [];
				if (data.has(text)) {
					const set = data.get(text);
				}
				set.push(textArray[i+1]);
				data.set(text,set);
			}

			// Generate output
			let output = [randomItem(textArray)];
			while (output.length < length) {
				const last  = output[output.length-1];
				if (data.has(last)) {
					output.push(randomItem(data.get(last)))
				}else{
					output.push(randomItem(textArray));
				}
			}
			message.channel.send(output.join(' ').substring(0,2000));
		});
	}
}