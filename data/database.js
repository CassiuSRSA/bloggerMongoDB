const mongodb = require("mongodb");
const uri =
  "mongodb+srv://cassius:sean1234@cluster0.67m2ynu.mongodb.net/?retryWrites=true&w=majority";

const MongoClient = mongodb.MongoClient;

let database;

const connectToDatabase = async () => {
  const client = await MongoClient.connect(uri);
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
