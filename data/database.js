const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://<username>:<password>@cluster0.67m2ynu.mongodb.net/?retryWrites=true&w=majority";

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
