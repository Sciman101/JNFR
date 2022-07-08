import {Low, JSONFile} from 'lowdb';
import {log} from './logger.js';

export default{

	init: async () => {

		const db = new Low(new JSONFile('db.json'));
		await db.read();
		log.info('Database initialized!');

	}

}