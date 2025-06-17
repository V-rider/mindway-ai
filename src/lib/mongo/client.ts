import { MongoClient, Db } from 'mongodb';
import { MONGO_URI, MONGO_DB_NAME } from '@/config/mongo';

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

if (!MONGO_DB_NAME) {
  throw new Error('Please define the MONGO_DB_NAME environment variable');
}

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToMongoDB() {
  if (client && db) {
    return { client, db };
  }

  client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    db = client.db(MONGO_DB_NAME);
    console.log('Successfully connected to MongoDB.');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    // Perform any necessary cleanup, like closing the client if partially connected
    if (client) {
        await client.close();
        client = null;
        db = null;
    }
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function getMongoDb() {
  if (!db) {
    await connectToMongoDB();
  }
  if (!db) {
    throw new Error("MongoDB not connected");
  }
  return db;
}

// Optional: Function to close the MongoDB connection, e.g., during application shutdown
export async function closeMongoDBConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed.');
  }
}

// Initialize connection when the module is loaded or when getMongoDb is first called.
// For a server environment, you might call connectToMongoDB() at application startup.
// For simplicity here, connection is established on first getMongoDb call.
