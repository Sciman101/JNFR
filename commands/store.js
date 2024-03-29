import { optional, numValue } from "../parser/arguments.js";
import {
  ITEM_RARITY_LABELS,
  ITEM_USABLE_LABEL,
  getItemQualities,
  randomItem,
  items,
} from "../data/items.js";
import Database, { db } from "../util/db.js";
import Babbler from "../util/babbler.js";
import { addItem } from "../util/inventoryHelper.js";
import { MONTHS } from "../util/arrays.js";
import { log } from "../util/logger.js";

// Get shop for the day
let shopDate = db.data?.jnfr?.shop_date || 0;
const SHOP_ITEM_COUNT = 6;

let inventory = db.data?.jnfr?.shop_inventory;
if (!inventory || shopDate != getDateString()) {
  randomizeStore();
}

function randomizeStore() {
  log.info("Regenerating shop inventory");
  // Generate items for the day
  db.data.jnfr.shop_inventory = inventory = [];
  for (let i = 0; i < SHOP_ITEM_COUNT; i++) {
    // Add 5 random items
    let item;
    do {
      item = randomItem();
    } while (
      inventory.length != 0 &&
      inventory.find((slot) => slot.item_id === item.id) &&
      item.buyable
    );
    inventory.push({
      item_id: item.id,
      stock: Math.floor(Math.random() * 2) + 1,
    });
  }
  db.data.jnfr.shop_date = getDateString();
  shopDate = db.data.jnfr.shop_date;

  Database.scheduleWrite();
}

export default {
  name: "store",
  aliases: ["shop", "buy"],
  description:
    "Spend your Jollars on random crap I found! Shop contents refresh every day",
  guildOnly: false,
  argTree: optional(numValue("item_number", 1, SHOP_ITEM_COUNT, true)),
  execute(message, args) {
    // Check if we need to reset the shop
    const shopNeedsReset = getDateString() !== shopDate;
    if (shopNeedsReset) {
      randomizeStore();
      Database.scheduleWrite();
    }

    const jollarSign = Babbler.getJollarSign(message.guild);
    const balance = Database.getUser(message.author.id.toString()).balance || 0;

    if (!args.item_number) {
      // Display shop

      const shopMessage = `
\`Shop for ${getDateString()}\`
=================
${inventory
  .map((slot, index) => {
    const item = items[slot.item_id];
    let itemDesc = `${index + 1}) **${item.name}** (x${slot.stock}) - \`${
      50 * (index + 1)
    }\`${jollarSign}`;
    const qualities = getItemQualities(item);
    if (qualities.length > 0) {
      itemDesc += "\n    **[** " + qualities.join(", ") + " **]**";
    }
    if (slot.stock === 0) {
      itemDesc = "~~" + itemDesc + "~~";
    }
    return itemDesc;
  })
  .join("\n\n")}
=================
You have ${balance.toLocaleString()} ${jollarSign}
\`Type j!shop [item number] to buy that item\`
			`;

      message.channel.send(shopMessage);
    } else {
      if (shopNeedsReset) {
        message.channel.send(
          "Heads up! The shop has re-stocked since it was last checked, and the item you want has changed. I won't say this again, so check what's in the shop today before continuing!"
        );
        return;
      }

      const itemIndex = args.item_number - 1;
      const itemSlot = inventory[itemIndex];
      const item_id = itemSlot.item_id;
      const item = items[item_id];
      const cost = (itemIndex + 1) * 50;
      if (itemSlot.stock <= 0) {
        // We can't sell this
        return message.reply(Babbler.get("out_of_stock", { item: item.name }));
      }

      const user = Database.getUser(message.author.id.toString());
      if (user.balance < cost) {
        return message.reply(
          Babbler.get("insufficient_funds", {
            jollar: jollarSign,
            user: message.author.username,
          })
        );
      }

      itemSlot.stock -= 1;
      user.balance -= cost;
      const userItemSlot = addItem(user, item_id);

      let response = `You bought '${item.name}' for ${cost} ${jollarSign}! Pleasure doing business with you`;

      // Try callback
      if (item.callbacks.bought) {
        response = item.callbacks.bought(message, user, userItemSlot, response);
      }
      message.reply(response);

      // Write data
      Database.scheduleWrite();
    }
  },
  randomizeStore: randomizeStore,
};

function getDateString() {
  const today = new Date();
  return `${MONTHS[
    today.getMonth()
  ].toUpperCase()} ${today.getDate()}, ${today.getFullYear()}`;
}
