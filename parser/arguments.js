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

// Wrap a node in this fella to make it optional
const optional = (node) => {
	return {
		optional: true, // Basically just a flag for the parser
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

	return {
		description: nodes.forEach(node => `'${node.description}' or`).toString().slice(1,-4),
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
	return {
		paths: paths,
		description: nodes.forEach(node => `'${node.description}'/`).toString().slice(1,-2),
		evaluate: (args,argIndex) => {
			for (let i=0;i<paths.length;i++) {
				let result = paths[i].node.evaluate(args,argIndex);
				if (!result.error) {
					result.next = paths[i].next;
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
		return 'below ' + max;
	}else if (min && !max) {
		return 'above ' + min;
	}else{
		return 'between ' + min + ' and ' + max;
	}
}

const numValue = (id, min,max,int,next) => {
	return {
		description: `'${id}' (a ${int ? 'whole number' : 'number'} ${rangeString(min,max)})`,
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

export {optional, literal, numValue, stringValue};