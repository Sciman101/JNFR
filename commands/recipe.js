import { stringValue } from "../parser/arguments.js";
import { findItem, getItemRecipe, getRecipeString } from "../data/items.js";
import Babbler from "../util/babbler.js";

export default {
  name: "recipe",
  description: "Learn the recipe to any item",
  guildOnly: false,
  argTree: stringValue("item", true),
  execute(message, args) {
    const item = findItem(args.item);
    if (item) {
      const recipe = getItemRecipe(item);
      return message.reply(
        `## ${item.name}\n**Ingredients:**\n${getRecipeString(
          recipe
        )}\n*${Babbler.get("crafting_instructions")}*`
      );
    } else {
      return message.reply("That item doesn't exist!");
    }
  },
};
