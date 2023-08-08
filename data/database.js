const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;

const connectToDatabase = async () => {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  database = client.db("blogger");
};

const getDb = () => {
  if (!database) {
    throw { message: "You must connect first!" };
  }
  return database;
};

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
