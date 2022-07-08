
export const generateCommandUsage = (cmdName,node) => {

	let usages = [];
	recursiveUsageGenerator(node,usages,cmdName + ' ');
	return usages;

};

const recursiveUsageGenerator = (node,usages,start) => {

	let usage = start;

	while (node) {

		// Check for multiple paths
		if (node.paths) {
			for (const index in node.paths) {
				recursiveUsageGenerator(node.paths[index],usages,usage);
			}
			return usages;
		}

		// otherwise
		let term = node.description;
		if (node.optional) {
			term = '['+term+']';
		}else if (!node.literal) {
			term = '<'+term+'>';
		}

		usage += term + ' ';

		node = node.next;
	}
	usages.push(usage);

};