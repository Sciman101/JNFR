import argumentParser from './argumentParser.js';
import emojiRegex from 'emoji-regex';
import {log} from '../util/logger.js';

/* Argument node structure:
	Take in
		args - array of string arguments
		argIndex - index of the current argument 
		context - object containing additional relevant info
	
	Output
		error - if null, we successfully found a match. Otherwise, a string describing the issue
		value - the extracted value in it's native form. i.e, an int for intvalue
		next - the next branch of the tree to parse
		nextIndex - OPTIONAL: the index of the next argument to parse. If left out, it defaults to argIndex+1

*/

// Wrap a node in this fella to make it optional
const optional = (node) => {
	return {
		optional: true, // Basically just a flag for the parser
		next: node,
		description: node.description,
		evaluate: (args,argIndex) => {
			if (argIndex >= args.length) {
				return {
					value: null
				}
			}else{
				return node.evaluate(args,argIndex);
			}
		}
	}
};

// Allows for any of multiple nodes
const any = (nodes,next) => {

	if (nodes.length === 0) {
		log.error('Any node set up with 0 children!');
	}

	const descText = nodes.map(node => node.description).join('/');

	return {
		description: descText,
		next: next,
		evaluate: (args,argIndex) => {
			for (let i=0;i<nodes.length;i++) {
				const result = nodes[i].evaluate(args,argIndex);
				if (!result.error) {
					return result;
				}
			}
			return {
				error: 'no matching argument provided'
			}
		}
	}
}

// Like any, but the chosen route becomes the new path to take
// example usage
// branch({node:literal('remove'),})
const branch = (paths) => {

	const descText = 'one of ' + paths.map(node => node.description).join(', ');

	return {
		paths: paths,
		description: descText,
		evaluate: (args,argIndex) => {
			for (let i=0;i<paths.length;i++) {
				let result = paths[i].evaluate(args,argIndex);
				if (!result.error) {
					result.next = result.next;
					return result;
				}
			}
			return {
				error: 'no matching argument provided'
			}
		}
	}
}

const literal = (literalString,next) => {
	return {
		literal: true,
		next: next,
		description: literalString,
		evaluate: (args, argIndex) => {
			return {
				error: args[argIndex] === literalString ? null : 'mismatched literal',
				value: literalString,
				next: next,
				id: literalString
			}
		}
	}
};

const rangeString = (min,max) => {
	if (!min && max) {
		return '<' + max;
	}else if (min && !max) {
		return '>' + min;
	}else{
		return '[' + min + ',' + max + ']';
	}
}

const numValue = (id, min,max,int,next) => {
	return {
		description: `${id} (${rangeString(min,max)})`,
		next: next,
		evaluate: (args, argIndex) => {
			let num = parseFloat(args[argIndex].trim());
			
			// Check if number exists
			if (Number.isNaN(num)) {
				return {
					error: `'${args[argIndex]}' is not a number`
				}
			}

			// Check if it matches our type
			if (!Number.isInteger(num) && int) {
				return {
					error: `'${num}' is not an integer`
				}
			}

			// Check if within range
			if ((typeof min === 'undefined' || num >= min) && (typeof max === 'undefined' || num <= max)) {
				return {
					value: num,
					next: next,
					id: id
				}
			}else{
				return {
					error: `${id} (${num}) needs to be ${rangeString(min,max)}`
				}
			}
		}
	}
};

const stringValue = (id,quoted,next) => {
	return {
		description: id,
		next: next,
		evaluate: (args, argIndex) => {

			const arg = args[argIndex].trim();

			if (!quoted || !arg.startsWith('"')) {
				// Just return the value
				return {
					value: args[argIndex].trim(),
					next: next,
					id: id
				}
			}else{

				let index = argIndex+1;
				while (index < args.length) {
					if (args[index].endsWith('"')) {
						return {
							value: args.slice(argIndex,index+1).join(' ').slice(1,-1),
							next: next,
							id: id
						}
					}
					index++;
				}
				return {
					error: 'No closing "'
				}

			}

		}
	}
}

const mentionTypePrefixes = {
	'channel':'<#',
	'user':'<@',
	'role':'<@&'
}

const discordMention = (id,type,next) => {
	const start = mentionTypePrefixes[type];
	return {
		description: type,
		next: next,
		evaluate: (args, argIndex) => {
			let mentionRaw = args[argIndex];
			if (mentionRaw.startsWith(start) && mentionRaw.endsWith('>')) {
				// Valid
				return {
					value: mentionRaw.slice(start.length,-1),
					next: next,
					id: id
				}
			}else{
				// Invalid
				return {
					error: 'invalid ' + type + ' mention'
				}
			}
		}
	}
}

const discordEmoji = (id,next) => {

	return {
		description: `emoji`,
		next: next,
		evaluate: (args, argIndex) => {
			const emojiRaw = args[argIndex];
			// Discord emoji
			if (emojiRaw.startsWith('<') && emojiRaw.endsWith('>')) {
				const secondColonIndex = emojiRaw.indexOf(':',2);
				const emojiName = emojiRaw.slice(2,secondColonIndex);
				const emojiId = emojiRaw.slice(secondColonIndex+1,-1);
				return {
					id: id,
					next: next,
					value: {
						name: emojiName,
						id: emojiId,
						toString: () => `<:${emojiName}:${emojiId}>`
					}
				}
			}else{
				// Unicode emoji?
				const re = emojiRegex();
				let match;
				let emojiUnicode;
				if ((match = re.exec(emojiRaw)) != null) {
					emojiUnicode = match[0];
					return {
						id: id,
						next: next,
						value: {
							unicode: emojiUnicode
						}
					}
				}
			}
			return {
				error: 'invalid emoji'
			}
		}
	}
}

export {optional, any, branch, literal, numValue, stringValue, discordMention, discordEmoji};