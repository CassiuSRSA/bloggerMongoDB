// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri =
//   "mongodb+srv://<username>:<password>@cluster0.67m2ynu.mongodb.net/?retryWrites=true&w=majority";

// let database;

// const connectToDatabase = async () => {
//   const client = await MongoClient.connect(uri);
//   database = client.db("blogger");
// };

// const getDb = () => {
//   if (!database) {
//     throw { message: "You must connect first!" };
//   }
//   return database;
// };

// module.exports = {
//   connectToDatabase: connectToDatabase,
//   getDb: getDb,
// };

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://cassius:sean1234@cluster0.67m2ynu.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let database;

async function connectToDatabase() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    database = await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    return database;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

connectToDatabase().catch(console.dir);

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
