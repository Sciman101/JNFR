import {log} from '../util/logger.js';
import {addItem} from '../util/inventoryHelper.js';
import Babbler from '../util/babbler.js';

export let items = {};
let numItems = 0;

export const ItemRarity = {
	COMMON: 1,
	RARE: 2,
	LEGENDARY: 3
}

export function rarityString(rarity) {
	switch (rarity) {
		case ItemRarity.COMMON:
			return 'Common';
		case ItemRarity.RARE:
			return 'Rare!'
		case ItemRarity.LEGENDARY:
			return '*Legendary!!*'
	}
}

export function randomItem() {
	const index = Math.floor(Math.random()*numItems);
	return items[Object.keys(items)[index]];
}

export function nameToId(name) {
	return name.toLowerCase().replaceAll(' ','_').replaceAll('-','_').replaceAll(/[^\w_]/g,'');
}

function createItem(name,description,rarity) {
	// Create id by replacing spaces and stripping alphanumeric
 	const id = nameToId(name);

	items[id] = {
		id: id,
		name: name,
		description: description,
		rarity: rarity || ItemRarity.COMMON,
		callbacks: []
	}
	numItems++;
	return items[id];
}

/*
	Callbacks:
		bought(message,user,itemslot,response)
		eaten(message,user,itemslot,response)
*/
function addCallback(item,name,effect) {
	item.callbacks[name] = effect;
	return item;
}

function setRaceCallback(newRace,successPrompt,failPrompt) {
	return (message,user,slot,response) => {
		if (user.race !== newRace) {
			user.race = newRace;
			if (slot.count == 0) slot.count = 1;
			response = successPrompt;
		}else{
			response = failPrompt;
		}
		return response;
	}
}

export function createItems() {

	// Item definitions begin below
	createItem("Healing Potion","A small vial of shimmering red liquid");
	createItem("Mana Potion","A bottle of blue, flourescent fluid",ItemRarity.RARE);
	createItem("Big Sword","A sword fit for a respectable knight");
	createItem("Small Sword","A sword fit for a beginner knight");
	createItem("Tiny Sword","A sword fit for a mouse knight");
	createItem("Collosal Sword","A sword fit for a really big knight");
	createItem("Training Sword","A sword fit for a knight in training");
	createItem("Spooky Potion","A bottle of swirling purple fluid, skull patterns floating inside",ItemRarity.RARE);
	createItem("Potted Plant","A small plant in a clay plant pot");

	addCallback(
		createItem("Fortune Cookie","It's still in it's wrapper - I wonder what your fortune is?..."),
		'eaten',
		(message,user,slot,response) => {
			return `You open the cookie, the slip of paper inside reads ${Babbler.get('fortune_cookie')}`;
		}
	);

	createItem("Fidget Spinner","SpeeEeEEeeEEEeen");
	createItem("Phone Book","Who still uses these??");
	createItem("Skull","Alas, poor Yorick...");
	createItem("Skull covered in vines","Alas, at least Yorick looks sick as hell",ItemRarity.RARE);
	createItem("iPhone 8","Every day this gets more obsolete!");
	createItem("Blackberry Phone","Ah, a businessperson, I see",ItemRarity.RARE);
	createItem("Boombox","Blast your tunes on the street like a hooligan");
	createItem("Banana","I stole this from a Whole Foods");
	createItem("Compass","For some reason this one always points east");
	createItem("Apple","I've kept like 5 doctors away with this");
	createItem("Grapefruit","Doesn't really look like a grape");
	createItem("Guava","It's a fruit!",ItemRarity.RARE);
	createItem("Plantains","Knockoff bananas");
	createItem("Cucumber","Idk what you want me to say. It's a cucumber");
	createItem("Pepperoni Pizza","Hot and ready!");
	createItem("Cheese Pizza","Ah, you're the type who likes plain cheese");
	createItem("Hawaiian Pizza","Wars have been fought over whether or not pineapple belongs on pizza, so I've been told",ItemRarity.RARE);
	createItem("Veggie Pizza","No animals were harmed in the making of this delicious 'za");
	createItem("NES","It's gonna take you back to the past...",ItemRarity.RARE);
	createItem("Circuit board","... wait, is this one of mine?...");
	createItem("Empty can of Pringles","Don't look at me, I can't eat these! Or anything, actually");
	createItem("Box of assorted LEGOs","Got these at a yard sale");
	createItem("Egg Timer","Looks nothing like an egg");
	createItem("Wooden Shield","It's got some arrows stuck in it");
	createItem("Ray Gun","Don't get excited, it's just a prop. I think",ItemRarity.RARE);
	createItem("Bucket of Tar","How am I gonna get rid of all this tar????");
	createItem("1kg of Lead","A one-kilogram ingot of lead");
	createItem("1kg of Feathers","A one-kilogram ingot of feathers");
	createItem("Plush Dragon","The fearsome dragon, reduced to a marketable plushie :pensive:",ItemRarity.RARE);
	createItem("Plush Dog","*muffled woof*");
	createItem("Plush Seal","Look at this thing. Lump of a dude. Love em");

	addCallback(
		createItem(":clown:",":clown:",ItemRarity.LEGENDARY),
		'used',
		setRaceCallback('Clown','You are now a :clown:','You are already a :clown:')
		);

	createItem("Iron Shield","It's dented to hell but it'll keep nasties away for a bit");
	createItem("Spiked Shield","The best defense is a good giant spike!");
	createItem("Really Cool Wig","I was google image searching for a really cool wig...",ItemRarity.LEGENDARY);
	createItem("Gold Bar","An ingot of solid gold. Why did I give you this??",ItemRarity.RARE);
	createItem("Brick","A brick");
	createItem("Big Brick","A brick, but bigger",ItemRarity.RARE);
	createItem("Roughly 40 Pounds of Ground Beef","Hey meat doesn't expire right? Oh no");
	createItem("Iekika Plushie","A plushie of Iekika the imp - now with spear accessory!");
	createItem("Uma Plushie","A plushie of Uma the slime - we filled this one with jello instead of cotton");
	createItem("Amber Plushie","A plushie of Amber the mechanic - featuring a real metal arm!");
	createItem("Jamie Plushie","A plushie of that rat bastard Jamie - included voicebox speaks over 100 taunts");
	createItem("Root Plushie","A plushie of Root the kobold - taxipants made from real taxis!");
	createItem("Darue Plushie","A plushie of Darue the plantoid - we used the same stuff they made stretch armstrong out of for the arms");
	createItem("Makana Plushie","A plushie of Makana the imp - featuring a built-in heating element");
	createItem("J.N.F.R. Plushie","A plushie of yours truly :)",ItemRarity.LEGENDARY);
	createItem("Orange Plushie","A plushie of Orange the rescue robot - with real jet thrusters!");
	createItem("Ru-B Plushie","A plushie of Ru-B the ex-police robot - Filled with real weapons-grade Armor Gel");
	createItem("Stolen Grocery Cart","The Stop & Shop mafia wants me dead for this one",ItemRarity.RARE);
	createItem("Rubix Cube","Good luck solving this one");
	createItem("Fire Hydrant","Just found it on the side of the road, all it took to get it out was an angle grinder");
	createItem("Little Pile of Dirt","You'll buy just about anything, won't you?");
	createItem("Marina Plushie","Calls you a bitch and drinks all your pepsi");
	createItem("Nerf Gun","It's this or nothing");
	createItem("Matchbox Car Set","Made from real matchboxes!");
	createItem("Bottled Water","As opposed to watered bottle");
	createItem("Watered Bottle","As opposed to bottled water",ItemRarity.RARE);
	createItem("Rock em Sock em Robots","A historical exhibit on primitive robots, only focused on violence...",ItemRarity.RARE);
	createItem("Virtual Boy","Hurts to use!");

	addCallback(
		createItem("Demon Core","A fun, radioactive... snack? That's what you use this for, right?",ItemRarity.LEGENDARY)
		,'bought',
		(message,user,slot,response) => {
			response += `\nAnd since you're such a good sport, I'll throw in a screwdriver for free!`;
			const screwdriver_type = Math.random() < 0.5 ? 'screwdriver_flat_head' : 'screwdriver_phillips_head';
			addItem(user,screwdriver_type);

			return response;
		}
	);

	createItem("Screwdriver (Flat Head)","Negatively charged screwdriver");
	createItem("Screwdriver (Phillips Head)","Positively charged screwdriver");
	createItem("Potted Succulent","A lil' succulent in a clay pot");
	createItem("NullPointerException","This one hurts to look at",ItemRarity.RARE);
	createItem("Rock","I heard they killed Abel with this one");
	createItem("Big Rock","About the size of a boulder");
	createItem("Boulder","About the size of a big rock");
	createItem("Zune","It only plays Smash Mouth songs",ItemRarity.RARE);
	createItem("Egg","How do you get the yolk out?...");
	createItem("Red Wagon","Perfect for carrying all this other shit you keep buying!");
	createItem("Stack of Pancakes","All sticky and sweet, blegh");
	createItem("Model Rocket","... wait, 'model'? Shit, I got ripped off!");
	createItem("Fine Art","I got it from a museum");
	createItem("Old Lamp","Doesn't even work");

	const voidCallback = setRaceCallback('Voidtouched',`S̵̨̼̗͚͕̠͖̰͊o̶̤̱̹̭̳̹͚͋̽͝m̸̛͎̘̜̖̤̱̰̙̀̋̈̉̿̈́͑͊̎̓́̑̇͂͒͝ͅe̵̯̬͓͍̜͖̘̱̰̞̋̀̅̐̍̓̇̈͒̇̽̄͊͑̐́͜͝ͅṱ̷̲̲͓̤͇̹͕̖̝̗͂̀̋̽̍̎̽͜h̶̡̨̛̩̻̺͙̹̳͍͓͎̭̭͎͙͂̽͋̃̽͜i̴̡̙̥͎̼̦̟̯̩̬̍͆́̾̏͗͌̍̂̊͒̀͒͘͜n̸̡̘̥̜̯̟̯͛͐͆̇̍͛́͗͝g̷̢̡̛̞͍̺̼̰̙̰͚̞͍̻̙͇̼͕͒̀́͗̏̐͆̿͑̌̾̎͋ ̷̛̦̣̲̣̦͔̆͛̋̎̀͋̈́͆͊́̾̈̕̕h̸̛̪͔͕̗̝̞̦̟̘̲̺̥̦̮͚̘̎͆͂̔̿͛̉͜a̴̧͚̥͙̮̬͈̲̼͎̤͈̤̫̭̓͋͐̎̚p̸͙̪͎̟͑́̿̒̀̀p̸̲̯̳̮̓̀̈́̾̅̔̓̿͑̒͒̌̔͂͘͝ȩ̴̧̩̱͓̙̺̳͚͇̤̈́͛͌̑̂̈́̑̓͛̚͝ͅṇ̶̨̡̢̨͍̻̖͕͓͍̼̹̪̇̈́͊̈́̄͂̃͆̔̎͗̃͗̀ͅṡ̵̜͇̻͒̏̐͒̎̏́͂̈́̎̀̀̔̒̚ͅ.̸̘͉̀̓̒̔̋̿̿̉̌̀̉̾͒̍ You feel funny. Something's changed`,'Nothing happened');
	const voidItem = createItem("Void","ì̴̡̛̤̤̺̬̙͍̟̕͘̚t̴̨̛̹͖̦̫͜ ̸̡̩̳͙̫̮͖̹̹͚̼̯̻̻͚̖̂͂́͌͋͂͜a̵̛̞̹̪̮͙͓͑̄̌̈́͂̈́̏̀̽̉̄̚͝͠ļ̸̛͎̥̳̞̹̫͉͇̼͇͐̐̃l̸͉̖̰̯̱̫̞͔̬̙̟̞͎͈͑̽́̆̈́̀͂̿̊͊͑̄̇̒̐͑͘ ̴̹̍̾͗̆̽͐͌̍̏̀̕ę̵̙̊͌͐̔̔ṋ̸̮̯̐̅͑̈́̉̽̅͒̿̈͐̎d̶̢̢̻̭͔̻̙̫̤̺̲͍̰͒̍͛̌͗͊͐̿̈́͊̚̚͘s̴̢̰̹̳͓̖̩̺̗̙̙̼̝͓̮̩̥̍͋̈́ ̵͍̟͔͌̀̃͐̎̐̅̓̽̎͋̉͠h̷̨̝̤̗̰̞̄̉̎͑̌̑̂͒̽̓̃̂͋́͒̆̚e̸̯̝̻͈̤̞͚͍̞̻̝̺̳͒̂̒͑̍̕̕͜͠ͅr̵̡̡̛͇̭̭̻̹͕̂̊͐̓̔̓̍̀̿͘e̷̲͔̘̩̤̗͗͂̈́̉̈́͊̓̓̕ͅ",ItemRarity.LEGENDARY);
	addCallback(voidItem,'used',voidCallback);
	addCallback(voidItem,'eaten',voidCallback);

	createItem("Felix Cube","Wait, isn't this just a Rubik's cube?...");
	createItem("Diamond Pickaxe","I came to dig, dig, dig, dig...",ItemRarity.RARE);
	createItem("Amazon Echo with a bullet lodged in it","You can thank me for that");
	createItem("Tub of 'Fun Slime'","Their wording, not mine");
	createItem("Barrel of Oil","I got this for free back when oil prices crashed");
	createItem("Fushigi Ball","You'll never compare to my mad fushigi skills >:)");
	createItem("A Little Bird","A little guy...");
	createItem("Rotary Phone","I don't know if you can actually use this nowadays");
	createItem("Sheep in a Box","It's totally in there trust me");
	createItem("Gamepad","Gamepad for which type of console? That's up to you");
	createItem("Silly Putty Egg","I'm not actually sure it has silly putty in there");
	createItem("Ome Plushie","A plushie of Ome the salamander - now with real shocking functionality!");
	createItem("Mariimo Plushie","A plushie of Mariimo the robot - about as clumsy as the real thing");
	createItem("Handfull of Small Frogs","A large handful");
	createItem("Trenchoat (Max Occupancy, 3 creatures)","Granted, it's 3 smallish creatures, but still");
	createItem("Soap","Light green with a slight minty scent");
	createItem("Soup","Bought from the local soup store");
	createItem("Clothes from the soup store","Actually very nice clothes, considering their source",ItemRarity.RARE);
	createItem("Tomato Sauce","Fresh from Italy");
	createItem("2kg of Lead","A 2 kilogram ball of solid lead");
	createItem("Complimentary Napkin","Did you really buy this on it's own?");
	createItem("Unarmed(?) Landmine","It's probably safe. Probably. Totally",ItemRarity.RARE);
	createItem("Atari 2600","The famous retro console itself");
	createItem("Bee the size of a dog","Comes with a leash so you can walk it like a balloon");
	createItem("Haunted Doll","Got it off eBay. Laughs creepily at night but otherwise harmless");
	createItem("Chicken Strips","It's kinda like fly paper but, for chickens. Right?");
	createItem("Macaroni and Cheese","Nobody stopped me");
	createItem("Wooden blocks","Not the kind with letters on the sides, just random pieces of wood");
	createItem("The concept of a Tuesday","What a concept!",ItemRarity.RARE);
	createItem("A locked box with the SCP logo on it","It needs a key...",ItemRarity.LEGENDARY);
	createItem("A key with the SCP logo on it","I wonder what this goes to...",ItemRarity.LEGENDARY);
	createItem("Blanket Wizard Plush","A plushie of Blanket Wizard - comes with blanket!");
	createItem("Antonio Meeple","A wooden meeple of Antonio");
	createItem("Rat","I picked this thing up in New York, it's enormous",ItemRarity.LEGENDARY);
	createItem("Old Telescope","This guy's been staring at the sky for years...");
	createItem("Deck of Cards","A standard 52 card deck");
	createItem("Tech Dech","A tiny skateboard for mice");
	createItem("Bloody Beyblade","A relic from the Beyblade wars of 2085",ItemRarity.RARE);
	createItem("Yellow Crowbar","Stolen from a raccoon",ItemRarity.RARE);
	createItem("Among Us Baby","?????",ItemRarity.LEGENDARY);
	createItem("1 meter cube of fudge","I was told this is a normal serving size",ItemRarity.RARE);
	createItem("Steampunk Alarm Clock","An alarm clock covered in gears and brass tubing, wearing a tiny top hat");
	createItem("Chessboard","A standard 9x9 chess board");
	createItem("Chess Pawn","The pawn - moves 1 space forward, captures diagonally, wraps around the board when it hits the edge");
	createItem("Chess King","The king - can only move and capture one space at a time, unless it's been infected. If you lose it, you lose the game");
	createItem("Chess Queen", "The queen - can move any number of spaces in any direction. Gets promoted to a pawn upon reaching the opponent's side of the board");
	createItem("Chess Bishop","The bishop - moves in a weird L shape");
	createItem("Chess Rook","The rook - moves in straight lines. Moves in gay lines during pride month");
	createItem("Chess Knight","The knight - horse");
	createItem("Javascript for Dummies book","How I was made");
	createItem("Trans Pride Flag themed XBOX Elite Controller","Only able to connect during the month of June, for some reason");
	createItem("Dead AA Battery","R.I.P, 2022-2022");
	createItem("Comically Large Wrench","Good luck picking it up, much less turning it");
	createItem("Toilet Seat with Scorch Marks","We don't talk about where this came from");
	createItem("Mario","Mario!",ItemRarity.LEGENDARY);
	createItem("Oblivia Plushie","A plushie of Oblivia Nyx - filled with real ink!");
	createItem("Busted Hard Drive","Used to be full of pirated MP3s");
	createItem("Booty shorts with 'ENEMY OF THE STATE' written across the ass","... don't look at me, you're the one who bought them");
	createItem("Joy-Con (Drifing)","Mint condition");
	createItem("Two Trucks","American made, built ford tough");
	createItem("A new car!!!","Brand new!! Mint contidion!! Nothing suspicious here!!");
	createItem("2 mile long aux cable","When you wanna listen to music from your pc as you drive to work");
	createItem("3,078,546.2 Grapes","Ok, I lied, it's 3,078,546.*1* grapes. Cry me a river");
	createItem("Tooth submerged in Coca-Cola","It's been in there for 7 years and it's still fine");
	createItem("Tiny spoon for baby ants","Like, it's *really* small. Trust me, you can't see it with the naked eye");
	createItem("Gold Choker","A gold-plated metal band that could fit around a slime's neck",ItemRarity.RARE);
	createItem("Ammo Box","No ammo inside, unfortunately - but someone did leave a grenade in here");
	createItem("Gargantuan Sword","A sword fit for a fucking gigantic knight",ItemRarity.RARE);
	createItem("Not so much a 'sword' as much a slab of vaugely sharpened iron","I think this used to be part of a bridge");
	createItem("Minceraft T-shirt","Minecraft Gamer? A real Minecraft Gamer?");
	createItem("Kitbashed JNFR Model","It's me :D");
	createItem("Long Egg","An egg that's about 3 feet long",ItemRarity.LEGENDARY);
	createItem("Wet Monopoly","Exactly what it sounds like");
	createItem("Laser Pointer","Pew pew pew (does not actually make sound)");
	createItem("Ball Lightning","Make sure to keep it tied down or it's gonna float around everywhere",ItemRarity.LEGENDARY);
	createItem("Peanut Butter & Jelly Sandwich","The best way to eat goop between two slices of bread");
	createItem("`[[HYPERLINK BLOCKED]]`","Bought this from a real big shot I ran into once",ItemRarity.RARE);
	createItem("Cheese Cylinder","Not a cheese *wheel*, to be clear");
	createItem("Empty Polaroid Camera","You do not need to smile");
	createItem("3dBenchy","The standard calibration tool for 3d printers");
	createItem("Book","An empty book");
	createItem("Notebook","An empty notebook");
	createItem("Colored Pencils","A set of pencils that draw in every color of the rainbow");
	createItem("Crayons","A set of wax crayons that draw in some of the colors of the rainbow");
	createItem("Iced Tea","A refreshing pitcher of iced tea");
	createItem("3kg of Lead","A 3 kilogram slab of lead metal");
	createItem("Floppy Disk","A relic from a bygone era... also the save icon");
	createItem("Bone Token","Gained from one of your creatures dying, for any reason");
	createItem("Chucky Cheese Arcade Token","Valid at any participating Chunky Cheese ~~restaurant~~ ~~entertainment center~~ ~~restaurant~~ ~~arcade~~ location");
	createItem("Baba is You Plushie","A plushie of Baba from Baba is you");
	createItem("Tank of Helium","Careful grab it it's floating away!!!!!!");
	createItem("Nothing","Why did you buy this?");
	createItem("Funko Pop","It's King Louie");
	createItem("Bucket of Slime","Harvested from local slimes (they did not give me permision (I'm in trouble))",ItemRarity.RARE);
	createItem("Pretty Dress","A pretty, powder blue dress");
	createItem("1-grit","A... chunk of concrete? I think?",ItemRarity.RARE);
	createItem("Pack of Post-it Notes","Great for taking notes or covering your friend's car");
	createItem("Loose Change","About $1.50, in total");
	createItem("Iekika's Tooth (Stolen)","Don't worry she's got like 4 sets of these to go",ItemRarity.RARE);
	createItem("Gamecube Controller (Full of Relish)","From a particularly heated melee tournament",ItemRarity.RARE);
	createItem("Two birds and a stone","They're friends :D");
	createItem("The worst sauce","Great for dipping fries");
	createItem("Breath Mint","You could use it...");
	createItem("Green T-Shirt with the Triforce on it","Stylish!");
	createItem("A really cool dog!!!!","Look at them! Look!!!!!!!");
	createItem("This thing I found in a dumpster","It's pretty nasty not gonna lie");
	createItem("Elephant's Foot (Like from an elephant)","Don't ask me how I got this",ItemRarity.RARE);

	createItem("Ice Cube","Nice and refreshing!");
	createItem("Black Ice Cube","Evil and refreshing!",ItemRarity.RARE);
	
	addCallback(
		createItem("Elephant's Foot (This will kill you if you buy it)","DEFINITELY don't ask me how I got this",ItemRarity.LEGENDARY),
		'bought',
		(message,user,slot,response) => {
			response = `Wh- didn't you read the name?? Well, you died, I guess. You lost all your jollars`;
			user.balance = 0;
			user.race = null;
			user.deaths = (user.deaths || 0)+1;
			return response;
		}
	);


	createItem("??? Plushie","A plushie of ???? - [REDACTED]",ItemRarity.RARE);
	createItem("Robot Foot","A foot from a robot");
	createItem("A jumbo serving of movie theater nachos","I've had these sitting around for months, hope you enjoy!");
	createItem("The United States Constitution (With a lemony scent?)","I spilled sauce on it once but you can't even notice",ItemRarity.RARE);
	createItem("Power brick","A charging brick for a laptop or other electronic device");
	createItem("Brick of power","A brick bestowed with incredible power",ItemRarity.RARE);
	createItem("Brick's Power","The power of the legendary hero, brick",ItemRarity.RARE);
	createItem("The Power of Brick","The power of a brick, truly incredible",ItemRarity.RARE);
	createItem("Bower Prick","Idk man");
	createItem("Phone case with the ghost of an iPhone in it","I would have gotten rid of the ghost but Genius bar exorcists suck",ItemRarity.RARE);
	createItem("Toki Pona Dictionary","toki! mi jan jnr");
	createItem("Disarmed warhead i swear it's totally safe","smiles :)",ItemRarity.RARE);

	addCallback(
		createItem('Die of Commerce','A magic 6-sided die that radiates mercentile energy.\n**When Used:** Refresh the current shop. Has a 1/6 chance to dissapear upon use.',ItemRarity.RARE),
		'used',
		(message,user,slot,response) => {
			const dissapear = Math.random() < 0.16666;
			response += `\nWith a roll of the dice, the shop is suddenly re-stocked with new items!${dissapear ? '\n\nAfter rolling, the dice crumbles into ash...':''}`;

			message.client.commands.get('store').randomizeStore();

			if (dissapear) {
				slot.count -= 1;
			}
			return response;
		}
	);

	createItem('69-Leaf Clover','Nice. I\'ve heard a rumor this thing **improves your luck** or something.',ItemRarity.LEGENDARY);

	log.info('Items initialized!');

}