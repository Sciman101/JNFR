import { nameToId } from "../data/items.js";

export function addItem(user, item_id, count) {
  count = count || 1;
  let slot = user.inventory.find((slot) => slot.id === item_id);
  if (!slot) {
    slot = { id: item_id, count: 0, owned: 0, eaten: 0, used: 0 };
    user.inventory.push(slot);
  }
  slot.count += count;
  slot.owned += count;

  return slot;
}

export function removeItem(user, item_id, count) {
  let slot = user.inventory.find((slot) => slot.id === item_id);
  if (!slot) {
    slot = { id: item_id, count: 0, owned: 0, eaten: 0, used: 0 };
    user.inventory.push(slot);
  }
  slot.count -= count || slot.count;

  return slot;
}

export function countItem(inventory, id) {
  for (const index in inventory) {
    const slot = inventory[index];
    if (slot.count > 0 && slot.id === id) {
      return slot.count;
    }
  }
  return 0;
}

export function searchInventory(inventory, search, allow0Count) {
  allow0Count = allow0Count || false;
  let results = [];

  // If a search term is contained in monospace characters, check for an exact id match
  if (search.startsWith("`") && search.endsWith("`") && search.length > 2) {
    const idSearch = search.substring(1, search.length - 1);
    console.log(idSearch);
    for (const index in inventory) {
      const slot = inventory[index];
      if (slot.count > 0 || (allow0Count && slot.owned > 0)) {
        if (slot.id === idSearch) {
          results.push(slot);
        }
      }
    }
  } else {
    // Name search
    const searchTerm = nameToId(search).replaceAll("_", "");
    for (const index in inventory) {
      const slot = inventory[index];
      if (slot.count > 0 || (allow0Count && slot.owned > 0)) {
        const index = slot.id.replaceAll("_", "").indexOf(searchTerm);
        if (index < 2 && index >= 0) {
          results.push(slot);
        }
      }
    }
  }
  return results;
}
