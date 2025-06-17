import { achievementApi } from '../achievements';
import { getMongoDb, connectToMongoDB, closeMongoDBConnection } from '@/lib/mongo/client';
import { ObjectId, Db } from 'mongodb';
import type { AchievementDocument } from '@/models/mongo/achievement';

describe('Achievement API', () => {
  let db: Db;
  const testAchievements: ObjectId[] = []; // To store IDs of created achievements for cleanup

  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      await connectToMongoDB(); // Ensure connection is established
      db = await getMongoDb();
    } catch (e) {
      console.error("Failed to connect to DB for achievements tests:", e);
      throw e; // Fail fast if DB connection is not working
    }
  });

  afterAll(async () => {
    // Cleanup: delete any achievements created during the tests
    if (testAchievements.length > 0 && db) {
      await db.collection<AchievementDocument>('achievements').deleteMany({
        _id: { $in: testAchievements }
      });
    }
    await closeMongoDBConnection();
    jest.restoreAllMocks();
  });

  it('should create a new achievement', async () => {
    const achievementData = {
      title: 'Test Achievement - Create',
      description: 'A test achievement.',
      criteria: 'Complete the test.',
      badge_url: 'http://example.com/badge.png',
      // created_at is set by the API
    };
    const newAchievement = await achievementApi.createAchievement(achievementData);
    expect(newAchievement).toBeDefined();
    expect(newAchievement).toHaveProperty('_id');
    expect(newAchievement?.title).toBe(achievementData.title);
    if (newAchievement?._id) {
      testAchievements.push(newAchievement._id); // Save for cleanup
    }
  });

  it('should get an achievement by ID', async () => {
    const achievementData = {
      title: 'Test Achievement - Get',
      description: 'Details for get test.',
      criteria: 'Be fetched.',
      badge_url: 'http://example.com/badge_get.png',
    };
    const createdAchievement = await db.collection<AchievementDocument>('achievements').insertOne({...achievementData, created_at: new Date()});
    const achievementId = createdAchievement.insertedId;
    testAchievements.push(achievementId);

    const fetchedAchievement = await achievementApi.getAchievementById(achievementId.toHexString());
    expect(fetchedAchievement).toBeDefined();
    expect(fetchedAchievement?._id.toHexString()).toBe(achievementId.toHexString());
    expect(fetchedAchievement?.title).toBe(achievementData.title);
  });

  it('should return null for a non-existent achievement ID', async () => {
    const nonExistentId = new ObjectId().toHexString();
    const fetchedAchievement = await achievementApi.getAchievementById(nonExistentId);
    expect(fetchedAchievement).toBeNull();
  });

  it('should return null for an invalid achievement ID', async () => {
    const invalidId = "thisisnotanobjectid";
    const fetchedAchievement = await achievementApi.getAchievementById(invalidId);
    expect(fetchedAchievement).toBeNull();
  });

  it('should update an achievement', async () => {
    const achievementData = {
      title: 'Test Achievement - Update Original',
      description: 'Original description.',
      criteria: 'Be updated.',
      badge_url: 'http://example.com/badge_update.png',
    };
    const created = await db.collection<AchievementDocument>('achievements').insertOne({...achievementData, created_at: new Date()});
    const achievementId = created.insertedId;
    testAchievements.push(achievementId);

    const updates = { title: 'Test Achievement - Updated Title' };
    const updatedAchievement = await achievementApi.updateAchievement(achievementId.toHexString(), updates);

    expect(updatedAchievement).toBeDefined();
    expect(updatedAchievement?._id.toHexString()).toBe(achievementId.toHexString());
    expect(updatedAchievement?.title).toBe(updates.title);

    // Verify in DB
    const dbAchievement = await db.collection<AchievementDocument>('achievements').findOne({_id: achievementId});
    expect(dbAchievement?.title).toBe(updates.title);
  });

  it('should delete an achievement', async () => {
    const achievementData = {
      title: 'Test Achievement - Delete',
      description: 'To be deleted.',
      criteria: 'Be deleted.',
      badge_url: 'http://example.com/badge_delete.png',
    };
    const created = await db.collection<AchievementDocument>('achievements').insertOne({...achievementData, created_at: new Date()});
    const achievementId = created.insertedId;
    // No need to add to testAchievements for cleanup, as this test deletes it.

    const وافقت = await achievementApi.deleteAchievement(achievementId.toHexString());
    expect(وافقت).toBe(true);

    const dbAchievement = await db.collection<AchievementDocument>('achievements').findOne({_id: achievementId});
    expect(dbAchievement).toBeNull();
  });

  it('should get all achievements', async () => {
    // Clear achievements and add a couple for this test
    await db.collection('achievements').deleteMany({});
    testAchievements.length = 0; // Clear array

    const achievement1Data = { title: 'GetAll Test 1', created_at: new Date() };
    const achievement2Data = { title: 'GetAll Test 2', created_at: new Date(Date.now() - 1000) }; // ensure different times for sorting
    await db.collection('achievements').insertMany([achievement1Data, achievement2Data]);
    testAchievements.push((await db.collection('achievements').findOne({title: 'GetAll Test 1'}))!._id);
    testAchievements.push((await db.collection('achievements').findOne({title: 'GetAll Test 2'}))!._id);


    const achievements = await achievementApi.getAchievements();
    expect(achievements).toBeDefined();
    expect(achievements.length).toBeGreaterThanOrEqual(2);
    // Test sorting (newest first)
    const firstTitle = achievements[0].title;
    const secondTitle = achievements[1].title;
    // This depends on exact insertion time and what else is in DB.
    // A more robust sort test would check created_at dates if titles are not unique identifiers of order.
    // For this basic test, we assume these are the only two and Test 1 is newer.
    expect(firstTitle).toBe('GetAll Test 1');
    expect(secondTitle).toBe('GetAll Test 2');
  });

  // Add more tests for other functions like awardAchievement, getStudentAchievements etc.
  // These will be more complex as they involve multiple collections and ObjectIds.
  // For example:
  // it('should award an achievement to a student', async () => { ... });
  // it('should get achievements for a student', async () => { ... });

});
