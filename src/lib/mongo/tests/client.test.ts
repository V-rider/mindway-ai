import { connectToMongoDB, closeMongoDBConnection, getMongoDb } from '../client';
import { MongoClient } from 'mongodb';

describe('MongoDB Client', () => {
  let connection: MongoClient;

  beforeAll(async () => {
    // Mock console.log and console.error to keep test output clean
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Attempt to connect before tests
    try {
      const { client } = await connectToMongoDB();
      connection = client;
    } catch (e) {
      // Allow tests to run and fail to show connection issue
      console.error("Initial connection failed in beforeAll:", e);
    }
  });

  afterAll(async () => {
    await closeMongoDBConnection();
    jest.restoreAllMocks(); // Restore console mocks
  });

  it('should connect to MongoDB and get the db instance', async () => {
    // This test now relies on beforeAll for connection
    expect(connection).toBeDefined();
    if (connection) { // Only proceed if connection was successful
      const db = await getMongoDb();
      expect(db).toBeDefined();
      // Ping the database to ensure it's responsive
      const pingResult = await db.admin().ping();
      expect(pingResult).toHaveProperty('ok', 1);
    } else {
      // Fail the test explicitly if connection is not defined
      throw new Error("MongoDB connection was not established in beforeAll");
    }
  });

  it('should reuse the existing connection', async () => {
    if (!connection) throw new Error("MongoDB connection not established");
    const { db: db1 } = await connectToMongoDB(); // Should use existing
    const { db: db2 } = await connectToMongoDB(); // Should also use existing
    expect(db1).toBe(db2); // Check if the same Db instance is returned
  });

  it('getMongoDb should return the db instance if connected', async () => {
    if (!connection) throw new Error("MongoDB connection not established");
    const db = await getMongoDb();
    expect(db).toBeDefined();
  });

  // Test for MONGO_URI and MONGO_DB_NAME undefined can be tricky due to module caching with jest.
  // It might require jest.resetModules() and careful handling.
  // For now, focusing on positive connection tests.
});
