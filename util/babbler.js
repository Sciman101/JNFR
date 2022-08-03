import fs from 'fs';
import {log} from './logger.js';
import {Collection} from 'discord.js';

const jollarCache = new Collection(); 

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


const init = () => {
	// Load text from strings.json
	fs.readFile('./data/strings.json',(err,data) => {
		if (err) {
			log.error('Unable to read data/strings.json!');
		}else{
			dialouge = JSON.parse(data);
			log.info('Loaded witty banter!');
		}
	});
}

const get = (key,placeholders,guild) => {

	if (!dialouge[key]) {
		log.error('Unknown dialouge key ',key);
		return 'MISSING DIALOUGE';
	}

	let dialougeString = randomFromArray(dialouge[key]);
	for (const key in placeholders) {
		dialougeString = dialougeString.replace('$'+key,placeholders[key]);
	}

	return dialougeString;
}

const getJollarSign = (guild) => {
	// Dms? or an error
	if (guild === null) {
		return '<:jollar:845407951136096317>';	
	}

	const id = guild.id.toString();
	let emojiText = jollarCache.get(id);
	if (!emojiText) {
		const emoji = guild.emojis.cache.find(emoji => emoji.name == 'jollar');

		if (!emoji) {
			emojiText = 'Jollar(s)';
		}else{
			emojiText = `<:jollar:${emoji.id}>`;
		}

		jollarCache.set(id,emojiText);
	}
	return emojiText;
}

export default {
	init, get, getJollarSign
}