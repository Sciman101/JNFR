const fs = require('fs');

let dialouge;
let logger;

function randomFromArray(arr) {
	return arr[Math.floor(Math.random()*arr.length)]
}

/*function generateDialouge(key,placeholders) {

	// Get base string
	const string = randomFromArray(dialouge[key]);
	let newString = '';
	let i=0;
	while (i<string.length) {
		const char = string[i];
		if (char !== '$' && char !== '@') {
			newString += char;
			i++;
		}else{
			const indexOfNextSpace = string.indexOf(' ',i);
			const endIndex = indexOfNextSpace === -1 ? string.length-1 : indexOfNextSpace;
			const tag = string.slice(i+1,endIndex);

			if (char === '$') {
				newString += placeholders[tag];
			}else{
				newString += generateDialouge(tag,placeholders);
			}
			i = endIndex+1;
		}
	}

	return newString;
}*/

module.exports = {

	init: (log) => {
		logger = log;
		// Load text from strings.json
		fs.readFile('./data/strings.json',(err,data) => {
			if (err) {
				logger.error('Unable to read data/strings.json!');
			}else{
				dialouge = JSON.parse(data);
				logger.info('Loaded witty banter!');
			}
		});
	},

	get: (key,placeholders) => {

		if (!dialouge[key]) {
			logger.err('Unknown dialouge key ',key);
			return 'MISSING DIALOUGE';
		}

		let dialougeString = randomFromArray(dialouge[key]);
		for (const key in placeholders) {
			dialougeString = dialougeString.replace('$'+key,placeholders[key]);
		}

		return dialougeString;
	}

}