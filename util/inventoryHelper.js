export function addItem(user,item,count) {
	count = count || 1;
	const slot = user.inventory[item.id] || {item:item,count:0,owned:0};
	slot.count += count;
	slot.owned += count;
	return slot;
}