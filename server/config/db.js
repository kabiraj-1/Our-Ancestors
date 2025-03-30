const { MongoClient } = require('mongodb');

// Replace <db_password> with your actual password and <db_name> with your database name
const uri = "mongodb+srv://bhattkabiraj255:9847546823Divy%40@cluster-kabi.fhxcsc6.mongodb.net/our-ancestors?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("Connected to MongoDB!");

        // Access the database
        const db = client.db("our-ancestors");

        // Example: List collections
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections);

        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        // Uncomment this line if you want to close the connection after operations
        // await client.close();
    }
}

module.exports = connectToDatabase;