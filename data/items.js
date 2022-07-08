import {log} from '../util/logger.js';

export let items = {};

export const ItemRarity = {
	COMMON: 1,
	RARE: 2,
	LEGENDARY: 3
}

function createItem(name,description,rarity) {
	// Create id by replacing spaces and stripping alphanumeric
 	const id = name.toLowerCase().replace(' ','_').replace('-','_').replace(/[^\w_]/g,'');

	items[id] = {
		id: id,
		name: name,
		description: description,
		rarity: rarity || ItemRarity.COMMON,
		callbacks: []
	}
	return items[id];
}

// Item definitions begin below
createItem("Healing Potion","A small vial of shimmering red liquid");
createItem("Mana Potion","A bottle of blue, flourescent fluid");
createItem("Big Sword","A sword fit for a respectable knight");
createItem("Small Sword","A sword fit for a beginner knight");
createItem("Tiny Sword","A sword fit for a mouse knight");
createItem("Collosal Sword","A sword fit for a really big knight");
createItem("Training Sword","A sword fit for a knight in training");
createItem("Spooky Potion","A bottle of swirling purple fluid, skull patterns floating inside");
createItem("Potted Plant","A small plant in a clay plant pot");
createItem("Fortune Cookie","It's still in it's wrapper - I wonder what your fortune is?...");
createItem("Fidget Spinner","SpeeEeEEeeEEEeen");
createItem("Phone Book","Who still uses these??");
createItem("Skull","Alas, poor Yorick...");
createItem("Skull covered in vines","Alas, at least Yorick looks sick as hell");
createItem("iPhone 8","Every day this gets more obsolete!");
createItem("Blackberry Phone","Ah, a businessperson, I see");
createItem("Boombox","Blast your tunes on the street like a hooligan");
createItem("Banana","I stole this from a Whole Foods");
createItem("Compass","For some reason this one always points east");
createItem("Apple","I've kept like 5 doctors away with this");
createItem("Grapefruit","Doesn't really look like a grape");
createItem("Guava","It's a fruit!");
createItem("Plantains","Knockoff bananas");
createItem("Cucumber","Idk what you want me to say. It's a cucumber");
createItem("Pepperoni Pizza","Hot and ready!");
createItem("Cheese Pizza","Ah, you're the type who likes plain cheese");
createItem("Hawaiian Pizza","Wars have been fought over whether or not pineapple belongs on pizza, so I've been told");
createItem("Veggie Pizza","No animals were harmed in the making of this delicious 'za");
createItem("NES","It's gonna take you back to the past...");
createItem("Circuit board","... wait, is this one of mine?...");
createItem("Empty can of Pringles","Don't look at me, I can't eat these! Or anything, actually");
createItem("Box of assorted LEGOs","Got these at a yard sale");
createItem("Egg Timer","Looks nothing like an egg");
createItem("Wooden Shield","It's got some arrows stuck in it");
createItem("Ray Gun","Don't get excited, it's just a prop. I think");
createItem("Bucket of Tar","How am I gonna get rid of all this tar????");
createItem("1kg of Lead","A one-kilogram ingot of lead");
createItem("1kg of Feathers","A one-kilogram ingot of feathers");
createItem("Plush Dragon","The fearsome dragon, reduced to a marketable plushie :pensive:");
createItem("Plush Dog","*muffled woof*");
createItem("Plush Seal","Look at this thing. Lump of a dude. Love em");
createItem(":clown:",":clown:");
createItem("Iron Shield","It's dented to hell but it'll keep nasties away for a bit");
createItem("Spiked Shield","The best defense is a good giant spike!");
createItem("Really Cool Wig","I was google image searching for a really cool wig...");
createItem("Gold Bar","An ingot of solid gold. Why did I give you this??");
createItem("Brick","A brick");
createItem("Big Brick","A brick, but bigger");
createItem("Roughly 40 Pounds of Ground Beef","Hey meat doesn't expire right? Oh no");
createItem("Iekika Plushie","A plushie of Iekika the imp - now with spear accessory!");
createItem("Uma Plushie","A plushie of Uma the slime - we filled this one with jello instead of cotton");
createItem("Amber Plushie","A plushie of Amber the mechanic - featuring a real metal arm!");
createItem("Jamie Plushie","A plushie of that rat bastard Jamie - included voicebox speaks over 100 taunts");
createItem("Root Plushie","A plushie of Root the kobold - taxipants made from real taxis!");
createItem("Darue Plushie","A plushie of Darue the plantoid - we used the same stuff they made stretch armstrong out of for the arms");
createItem("Makana Plushie","A plushie of Makana the imp - featuring a built-in heating element");
createItem("J.N.F.R. Plushie","A plushie of yours truly :)");
createItem("Orange Plushie","A plushie of Orange the rescue robot - with real jet thrusters!");
createItem("Ru-B Plushie","A plushie of Ru-B the ex-police robot - Filled with real weapons-grade Armor Gel");
createItem("Stolen Grocery Cart","The Stop & Shop mafia wants me dead for this one");
createItem("Rubix Cube","Good luck solving this one");
createItem("Fire Hydrant","Just found it on the side of the road, all it took to get it out was an angle grinder");
createItem("Little Pile of Dirt","You'll buy just about anything, won't you?");
createItem("Marina Plushie","Calls you a bitch and drinks all your pepsi");
createItem("Nerf Gun","It's this or nothing");
createItem("Matchbox Car Set","Made from real matchboxes!");
createItem("Bottled Water","As opposed to watered bottle");
createItem("Watered Bottle","As opposed to bottled water");
createItem("Rock em Sock em Robots","A historical exhibit on primitive robots, only focused on violence...");
createItem("Virtual Boy","Hurts to use!");
createItem("Demon Core","I'll throw a free screwdriver in, just for kicks");
createItem("Screwdriver (Flat Head)","Negatively charged screwdriver");
createItem("Screwdriver (Phillips Head)","Positively charged screwdriver");
createItem("Potted Succulent","A lil' succulent in a clay pot");
createItem("NullPointerException","This one hurts to look at");
createItem("Rock","I heard they killed Abel with this one");
createItem("Big Rock","About the size of a boulder");
createItem("Boulder","About the size of a big rock");
createItem("Zune","It only plays Smash Mouth songs");
createItem("Egg","How do you get the yolk out?...");
createItem("Red Wagon","Perfect for carrying all this other shit you keep buying!");
createItem("Stack of Pancakes","All sticky and sweet, blegh");
createItem("Model Rocket","... wait, 'model'? Shit, I got ripped off!");
createItem("Fine Art","I got it from a museum");
createItem("Old Lamp","Doesn't even work");
createItem("Void","ì̴̡̛̤̤̺̬̙͍̟̕͘̚t̴̨̛̹͖̦̫͜ ̸̡̩̳͙̫̮͖̹̹͚̼̯̻̻͚̖̂͂́͌͋͂͜a̵̛̞̹̪̮͙͓͑̄̌̈́͂̈́̏̀̽̉̄̚͝͠ļ̸̛͎̥̳̞̹̫͉͇̼͇͐̐̃l̸͉̖̰̯̱̫̞͔̬̙̟̞͎͈͑̽́̆̈́̀͂̿̊͊͑̄̇̒̐͑͘ ̴̹̍̾͗̆̽͐͌̍̏̀̕ę̵̙̊͌͐̔̔ṋ̸̮̯̐̅͑̈́̉̽̅͒̿̈͐̎d̶̢̢̻̭͔̻̙̫̤̺̲͍̰͒̍͛̌͗͊͐̿̈́͊̚̚͘s̴̢̰̹̳͓̖̩̺̗̙̙̼̝͓̮̩̥̍͋̈́ ̵͍̟͔͌̀̃͐̎̐̅̓̽̎͋̉͠h̷̨̝̤̗̰̞̄̉̎͑̌̑̂͒̽̓̃̂͋́͒̆̚e̸̯̝̻͈̤̞͚͍̞̻̝̺̳͒̂̒͑̍̕̕͜͠ͅr̵̡̡̛͇̭̭̻̹͕̂̊͐̓̔̓̍̀̿͘e̷̲͔̘̩̤̗͗͂̈́̉̈́͊̓̓̕ͅ");
createItem("Felix Cube","Wait, isn't this just a Rubik's cube?...");
createItem("Diamond Pickaxe","I came to dig, dig, dig, dig...");
createItem("Amazon Echo with a bullet lodged in it","You can thank me for that");
createItem("Tub of 'Fun Slime'","Their wording, not mine");
createItem("Barrel of Oil","I got this for free back when oil prices crashed");
createItem("Fushigi Ball",
createItem("A Little Bird",
createItem("Rotary Phone",
createItem("Sheep in a Box",
createItem("Gamepad",
createItem("Silly Putty Egg",
createItem("Ome Plushie",
createItem("Mariimo Plushie",
createItem("Handfull of Small Frogs",
createItem("Trenchoat (Max Occupancy, 3 creatures)",
createItem("Soap",
createItem("Soup",
createItem("Clothes from the soup store",
createItem("Tomato Sauce",
createItem("2kg of Lead",
createItem("Complimentary Napkin",
createItem("Unarmed(?) Landmine",
createItem("Atari 2600",
createItem("Bee the size of a dog",
createItem("Haunted Doll",
createItem("Chicken Strips",
createItem("Macaroni and Cheese",
createItem("Wooden blocks",
createItem("The concept of a Tuesday",
createItem("A locked box with the SCP logo on it",
createItem("A key with the SCP logo on it",
createItem("Blanket Wizard Plush",
createItem("Fabio Meeple",
createItem("Rat",
createItem("Old Telescope",
createItem("Deck of Cards",
createItem("Tech Dech",
createItem("Bloody Beyblade",
createItem("Yellow Crowbar",
createItem("Among Us Baby",
createItem("1 meter cube of fudge",
createItem("Steampunk Alarm Clock",
createItem("Chessboard",
createItem("Chess Pawn",
createItem("Chess King",
createItem("Chess Queen",
createItem("Chess Bishop",
createItem("Chess Rook",
createItem("Chess Knight",
createItem("Javascript for Dummies book",
createItem("Trans Pride Flag themed XBOX Elite Controller",
createItem("Dead AA Battery",
createItem("Comically Large Wrench",
createItem("Toilet Seat with Scorch Marks",
createItem("Mario",
createItem("Oblivia Plushie",
createItem("Busted Hard Drive",
createItem("Booty shorts with 'ENEMY OF THE STATE' written across the ass",
createItem("Joy-Con (Drifing)",
createItem("Two Trucks",
createItem("A new car!!!",
createItem("2 mile long aux cable",
createItem("3,078,546.2 Grapes",
createItem("Tooth submerged in Coca-Cola",
createItem("Tiny spoon for baby ants",
createItem("Gold Choker",
createItem("Ammo Box",
createItem("Gargantuan Sword",
createItem("Not so much a 'sword' as much a slab of vaugely sharpened iron",
createItem("Minceraft T-shirt",
createItem("Kitbashed JNFR Model",
createItem("Long Egg",
createItem("Wet Monopoly",
createItem("Snap Electronics Kit",
createItem("Laser Pointer",
createItem("Ball Lightning",
createItem("Peanut Butter & Jelly Sandwich",
createItem("`[[HYPERLINK BLOCKED]]`",
createItem("Cheese Cylinder",
createItem("Empty Polaroid Camera",
createItem("3dBenchy",
createItem("Book",
createItem("Notebook",
createItem("Colored Pencils",
createItem("Crayons",
createItem("Iced Tea",
createItem("3kg of Lead",
createItem("Floppy Disk",
createItem("Bone Token",
createItem("Chucky Cheese Arcade Token",
createItem("Baba is You Plushie",
createItem("Tank of Helium",
createItem("Nothing",
createItem("Funko Pop",
createItem("Bucket of Slime",
createItem("Pretty Dress",
createItem("1-grit",
createItem("Pack of Post-it Notes",
createItem("Loose Change",
createItem("Iekika's Tooth (Stolen)",
createItem("Gamecube Controller (Full of Relish)",
createItem("Two birds and a stone",
createItem("JavaScript for Dummies",
createItem("The worst sauce",
createItem("Breath Mint",
createItem("Green T-Shirt with the Triforce on it",
createItem("A really cool dog!!!!",
createItem("This thing I found in a dumpster",
createItem("Elephant's Foot (Like from an elephant)",
createItem("Elephant's Foot (This will kill you if you buy it)",
createItem("??? Plushie",
createItem("Robot Foot",
createItem("A jumbo serving of movie theater nachos",
createItem("The United States Constitution (With a lemony scent?)",
createItem("Power brick",
createItem("Brick of power",
createItem("Brick's Power",
createItem("The Power of Brick",
createItem("Bower Prick",
createItem("Phone case with the ghost of an iPhone in it",
createItem("Toki Pona Dictionary",
createItem("Disarmed warhead i swear it's totally safe"

log.info('Items initialized!');