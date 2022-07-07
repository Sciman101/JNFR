const {MongoClient, ServerApiVersion } = require('mongodb');
const {dbPassword, dbName} = require('../config.json');

const uri = `mongodb+srv://jnfr:${dbPassword}@jnfr.v4qch.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let logger;

module.exports = {

	init: (log) => {
		logger = log;
		try {
			await client.connect();

			const database = client.db(dbName);

		}catch (e) {
			logger.error(e);
		}finally{
			await client.close();
		}
	}

}