module.exports = {
    searchInventory(inventory, search) {
        const searchTerm = search.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').toLowerCase();
        let results = [];
        for (const item in inventory) {
            if (inventory[item] > 0) {
                const index = item.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').indexOf(searchTerm);
                if (index < 2 && index >= 0) {
                    results.push(item);
                }
            }
        }
        return results;
    }
}