
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

// Helper function for error handling
const handleDbError = (error: any, operation: string) => {
  console.error(`Error in ${operation}:`, error);
};

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

app.get('/api/documents/:id', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }
    
    const document = await db.collection('documents').findOne({ _id: new ObjectId(id) });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
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

app.put('/api/documents/:id', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }
    
    const result = await db.collection('documents')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...req.body, updated_at: new Date() } },
        { returnDocument: 'after' }
      );
    
    if (!result) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }
    
    const result = await db.collection('documents').deleteOne({ _id: new ObjectId(id) });
    res.json({ success: result.deletedCount === 1 });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/documents/class/:classId', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { classId } = req.params;
    
    if (!ObjectId.isValid(classId)) {
      return res.status(400).json({ error: 'Invalid class ID' });
    }
    
    const documents = await db.collection('documents')
      .find({ class_id: new ObjectId(classId) })
      .toArray();
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents by class:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/documents/user/:userId', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { userId } = req.params;
    
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const documents = await db.collection('documents')
      .find({ uploaded_by: new ObjectId(userId) })
      .toArray();
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents by user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Document Analysis API
app.get('/api/documents/:documentId/analysis', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { documentId } = req.params;
    
    if (!ObjectId.isValid(documentId)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }
    
    const analysis = await db.collection('documentAnalysis')
      .find({ document_id: new ObjectId(documentId) })
      .toArray();
    res.json(analysis);
  } catch (error) {
    console.error('Error fetching document analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/documents/:documentId/analysis', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { documentId } = req.params;
    
    if (!ObjectId.isValid(documentId)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }
    
    const analysis = {
      ...req.body,
      document_id: new ObjectId(documentId),
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await db.collection('documentAnalysis').insertOne(analysis);
    res.status(201).json({ ...analysis, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating document analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Document Annotations API
app.get('/api/documents/:documentId/annotations', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { documentId } = req.params;
    
    if (!ObjectId.isValid(documentId)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }
    
    const annotations = await db.collection('documentAnnotations')
      .find({ document_id: new ObjectId(documentId) })
      .toArray();
    res.json(annotations);
  } catch (error) {
    console.error('Error fetching document annotations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/documents/:documentId/annotations', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { documentId } = req.params;
    
    if (!ObjectId.isValid(documentId)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }
    
    const annotation = {
      ...req.body,
      document_id: new ObjectId(documentId),
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await db.collection('documentAnnotations').insertOne(annotation);
    res.status(201).json({ ...annotation, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating document annotation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/documents/annotations/:id', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid annotation ID' });
    }
    
    const result = await db.collection('documentAnnotations')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...req.body, updated_at: new Date() } },
        { returnDocument: 'after' }
      );
    
    if (!result) {
      return res.status(404).json({ error: 'Annotation not found' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error updating annotation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/documents/annotations/:id', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid annotation ID' });
    }
    
    const result = await db.collection('documentAnnotations').deleteOne({ _id: new ObjectId(id) });
    res.json({ success: result.deletedCount === 1 });
  } catch (error) {
    console.error('Error deleting annotation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Document Highlights API
app.get('/api/documents/:documentId/highlights', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { documentId } = req.params;
    
    if (!ObjectId.isValid(documentId)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }
    
    const highlights = await db.collection('documentHighlights')
      .find({ document_id: new ObjectId(documentId) })
      .toArray();
    res.json(highlights);
  } catch (error) {
    console.error('Error fetching document highlights:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/documents/:documentId/highlights', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { documentId } = req.params;
    
    if (!ObjectId.isValid(documentId)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }
    
    const highlight = {
      ...req.body,
      document_id: new ObjectId(documentId),
      created_at: new Date()
    };
    
    const result = await db.collection('documentHighlights').insertOne(highlight);
    res.status(201).json({ ...highlight, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating document highlight:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/documents/highlights/:id', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid highlight ID' });
    }
    
    const result = await db.collection('documentHighlights').deleteOne({ _id: new ObjectId(id) });
    res.json({ success: result.deletedCount === 1 });
  } catch (error) {
    console.error('Error deleting highlight:', error);
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

app.get('/api/users/:id', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const db = await getMongoDb();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    const user = {
      ...req.body,
      enrolled_class_ids: [],
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await db.collection('users').insertOne(user);
    res.status(201).json({ ...user, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Check if email is being changed and if it already exists
    if (req.body.email) {
      const existingUser = await db.collection('users').findOne({ 
        email: req.body.email, 
        _id: { $ne: new ObjectId(id) } 
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Another user with this email already exists' });
      }
    }
    
    const result = await db.collection('users')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...req.body, updated_at: new Date() } },
        { returnDocument: 'after' }
      );
    
    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const db = await getMongoDb();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    res.json({ success: result.deletedCount === 1 });
  } catch (error) {
    console.error('Error deleting user:', error);
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
