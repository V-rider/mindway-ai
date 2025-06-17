import express from 'express';
import cors from 'cors';
import { connectToMongoDB, getMongoDb } from '../src/lib/mongo/client';
import { ObjectId } from 'mongodb';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToMongoDB().catch(console.error);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Documents API
app.get('/api/documents', async (req, res) => {
  try {
    const db = await getMongoDb();
    const documents = await db.collection('documents').find().toArray();
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const db = await getMongoDb();
    const document = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date()
    };
    const result = await db.collection('documents').insertOne(document);
    res.status(201).json({ ...document, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Users API
app.get('/api/users', async (req, res) => {
  try {
    const db = await getMongoDb();
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Classes API
app.get('/api/classes', async (req, res) => {
  try {
    const db = await getMongoDb();
    const classes = await db.collection('classes').find().toArray();
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Achievements API
app.get('/api/achievements', async (req, res) => {
  try {
    const db = await getMongoDb();
    const achievements = await db.collection('achievements').find().toArray();
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 