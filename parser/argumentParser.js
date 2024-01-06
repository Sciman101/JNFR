export default (argArray, argTreeNode) => {
  let argIndex = 0;
  let parsedValues = {};

  // Move down the arg tree
  while (argTreeNode != null) {
    if (!argTreeNode.optional && argIndex >= argArray.length) {
      return {
        index: argIndex - 1,
        error: `Missing argument - ${argTreeNode.description}`,
        node: argTreeNode,
      };
    }

    // Run the branch
    const result = argTreeNode.evaluate(argArray, argIndex);

    if (result.error) {
      return {
        index: argIndex,
        error: result.error,
        node: argTreeNode,
      };
    } else {
      parsedValues[result.id] = result.value;
      // Advance down tree
      argTreeNode = result.next;
      // Advance index
      argIndex = result.nextIndex || argIndex + 1;
    }
  }
  // Return the parsed values
  return { args: parsedValues };
};
