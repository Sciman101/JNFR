import { discordMention, stringValue } from "../parser/arguments.js";
import Database, { db } from "../util/db.js";

const adjectives = [
  "cool",
  "awesome",
  "stinky",
  "slimy",
  "big",
  "small",
  "electronic",
  "plastic",
  "icy",
  "flaming",
  "dark",
  "light",
  "shadowy",
  "flaky",
  "glowing",
  "paper",
  "stumbling",
];

const dangerAdjectives = [
  "glitched",
  "four-armed",
  "wifi-enabled",
  "synthetic",
  "eldritch",
  "void-touched",
  "voxel-y",
  "godlike",
  "demonic",
  "loud",
  "hungry",
];

export default {
  name: "mutate",
  aliases: ["alter"],
  description: "Set a user's species",
  argTree: discordMention("user", "user", stringValue("race", true)),
  guildOnly: true,
  execute(message, args) {
    let race = args.race;
    const userData = Database.getUser(args.user);
    userData.race = args.race;
    userData.geneticInstability = (userData.geneticInstability || 0) + 1;
    Database.scheduleWrite();

    // Apply genetic instability
    const adjCount = Math.max(
      Math.floor((userData.geneticInstability - 50) / 30),
      0
    );
    let modifier = "";
    for (let i = 0; i < adjCount; i++) {
      const array =
        userData.geneticInstability >= 100
          ? Math.random() < 0.2
            ? dangerAdjectives
            : adjectives
          : adjectives;
      modifier +=
        array[Math.floor(Math.random() * array.length)] +
        (i == adjCount - 1 ? " " : ", ");
    }
    race = modifier + race;

    return message.reply("User has been turned into a " + race);
  },
};
