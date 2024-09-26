import { duckIt } from "node-duckduckgo";

export default {
  name: "duckduckbang",
  description: "Adds support for DuckDuckGo's bang! search within discord",
  args: null,
  guildOnly: false,
  hidden: true,
  execute(message, args) {
    message.reply(
      "The full list of available bangs can be found at https://duckduckgo.com/bang"
    );
  },
  listeners: {
    messageCreate: function (message) {
      // Ignore certain messages
      if (
        message.author.bot ||
        !message.cleanContent.startsWith("!!") ||
        message.cleanContent.startsWith("!!!") ||
        message.cleanContent == "!!"
      )
        return;

      // Format is !(bang) - ex. !!w mario
      doBangSearch(message.cleanContent.substring(1), message);
    },
  },
};

async function doBangSearch(query, message) {
  const response = await duckIt(query);
  if (
    response.status == 200 &&
    response.request.res &&
    response.request.res.responseUrl &&
    !response.request.res.responseUrl.startsWith("https://duckduckgo.com")
  ) {
    return message.reply(response.request.res.responseUrl);
  } else {
    message.react("🚫");
  }
}
