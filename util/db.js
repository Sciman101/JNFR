import { Low, JSONFile } from "lowdb";
import { log } from "./logger.js";

const SCHEDULED_WRITE_TIMEOUT = 5000;
const DB_PATH = "storage/db.json";

export let db;

let writeQueued = false;

export default {
  init: async () => {
    const _db = new Low(new JSONFile(DB_PATH));
    await _db.read();
    db = _db;

    if (!db.data || Object.keys(db.data).length === 0) {
      db.data = {
        users: {},
        guilds: {},
        jnfr: {
          pot: 0,
          shop_date: null,
        },
      };
      db.write();
    }

    log.info("Database initialized!");
  },

  getUser: (id) => {
    if (!db.data.users[id]) {
      db.data.users[id] = {
        balance: 0,
        inventory: [],
        deaths: 0,
        race: "Human",
      };
    }
    return db.data.users[id];
  },

  getGuild: (id) => {
    if (!db.data.guilds[id]) {
      db.data.guilds[id] = {
        pinboard: {},
        emojiroles: [],
        admins: { "160121042902188033": true },
      };
    }
    return db.data.guilds[id];
  },

  scheduleWrite: () => {
    if (!writeQueued) {
      log.info("Writing database contents in ", SCHEDULED_WRITE_TIMEOUT, "ms");
      writeQueued = true;
      setTimeout(() => {
        db.write();
        writeQueued = false;
        log.info("Database contents written");
      }, SCHEDULED_WRITE_TIMEOUT);
    }
  },
};
