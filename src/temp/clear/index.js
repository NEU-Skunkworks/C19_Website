require('dotenv').config();
const { connectDatabase } = require('../../database');

const clear = async () => {
  console.log(`[clear]: Running...`);
  let db;
  try {
    db = await connectDatabase(__filename);
    const collections = await db.connection.db.collections();

    for (const collection of collections) {
      await collection.drop();
    }

    console.log(`[clear]: Success`);
  } catch (error) {
    console.log(error.stack);
    console.log(`[clear]: Error, failed to clear database`);
  } finally {
    if (db) {
      db.connection.close();
    }
  }
};

clear();
