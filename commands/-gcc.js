const fs = require('fs');
const { exec } = require("child_process");

module.exports = {
	name: 'gcc',
	aliases: [],
	cooldown: 1,
	description: 'Compile C code and upload the finished executable. Why not! Format with triple backticks, or no backticks',
	args:true,
	usage:'<C Code>',
	guildOnly:false,
	execute(message, args) {

		// Get code
		let code = args.join(' ');
		if (code.startsWith('```')) {
			code = code.slice(3);
		}
		if (code.endsWith('```')) {
			code = code.slice(0,-3);
		}

		// Write to file
		fs.writeFile('./compiler/code.c',code, function(err) {
			if (err) {
				return message.reply('There was an error writing your code to file! ' + err.replace('`','\`'));
			}
		});
		message.reply('Trying to compile...');

		// Run compilation file
		exec(`gcc compiler/code.c -o compiler/compiled`, (err,stdout,stderr) => {
			if (err) {
				return message.reply('Error compiling! ```' + stderr + '```');
			}else{
				return message.reply('Compilation completed!',{files:['./compiler/compiled.exe']});
			}
		});

	}
}