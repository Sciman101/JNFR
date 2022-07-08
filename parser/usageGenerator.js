
export const generateCommandUsage = (node) => {

	// Traverse tree
	let usage = [];
	while (node != null) {

		let term = node.description;
		if (node.optional) {
			term = '['+term+']';
		}else{
			term = '<'+term+'>';
		}
		usage.push(term);
		node = node.next;
	}
	return usage.join('');

};