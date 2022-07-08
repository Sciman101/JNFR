import argumentParser from './argumentParser.js';

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

const literal = (literalString,next) => {
	return {
			description: literalString,
			evaluate: (args, argIndex) => {
				return {
					error: args[argIndex] === literalString ? null : 'Mismatched literal',
					value: literalString,
					next: next
				}
			}
	}
};

const numValue = (min,max,int,next) => {
	return {
		description: `${int ? 'integer' : 'number'} in range [${min},${max}]`,
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
					next: next
				}
			}else{
				return {
					error: `${num} is out of bounds [${min},${max}]`
				}
			}
		}
	}
};

const stringValue = (quoted,next) => {
	return {
		description: "a string",
		evaluate: (args, argIndex) => {

			const arg = args[argIndex].trim();

			if (!quoted || !arg.startsWith('"')) {
				// Just return the value
				return {
					value: args[argIndex].trim(),
					next: next
				}
			}else{

				let index = argIndex+1;
				while (index < args.length) {
					if (args[index].endsWith('"')) {
						return {
							value: args.slice(argIndex,index+1).join(' ').slice(1,-1),
							next: next
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

export {literal, numValue, stringValue};