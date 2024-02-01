export default {
  name: "alphabetize",
  description: "Convert the last message sent to alphabetical order",
  guildOnly: false,
  async execute(message, args) {
    // https://stackoverflow.com/questions/70646350/how-do-i-get-the-last-message-sent-in-a-channel-discord-js-v13
    const lastMessages = await message.channel.messages.fetch({ limit: 2 });
    const previousMessage = lastMessages.last();
    try {
      message.channel.send(
        previousMessage.cleanContent.split("").sort().join("")
      );
    } catch (e) {}
  },
};
