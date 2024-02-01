import {
  numValue,
  stringValue,
  branch,
  optional,
} from "../parser/arguments.js";

export default {
  name: "random",
  aliases: ["r"],
  description:
    "Randomly generate a number, or pick a random element from a sequence",
  guildOnly: false,
  argTree: branch([
    numValue(
      "a",
      undefined,
      undefined,
      true,
      optional(numValue("b", undefined, undefined, true))
    ),
    stringValue("options", true),
  ]),
  execute(message, args) {
    if (args.options) {
      const items = args.options.split(" ");
      const result = items[Math.floor(Math.random() * items.length)];
      return message.reply(`Randomly chose:\n ${result}`);
    } else {
      const max = args.b || args.a;
      const min = args.b ? args.a : 1;
      if (min > max) {
        return message.reply(
          `First number has to be less than the second! \`(${min} > ${max})\``
        );
      }
      const result = Math.floor(Math.random() * (max - min)) + min;
      return message.reply(
        `Random number between ${min} and ${max}: \`${result}\``
      );
    }
  },
};
