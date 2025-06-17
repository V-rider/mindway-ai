import { getDbInstance, handleDbError } from '@/lib/supabase/client';
import { ObjectId } from 'mongodb';
import type { MathChallengeDocument } from '@/models/mongo/math_challenge';
import type { ChallengeAttemptDocument } from '@/models/mongo/challenge_attempt';
import type { UserDocument } from '@/models/mongo/user';

const CHALLENGES_COLLECTION = 'mathChallenges';
const ATTEMPTS_COLLECTION = 'challengeAttempts';
const USERS_COLLECTION = 'users';

export const challengeApi = {
  async getChallenges(): Promise<MathChallengeDocument[]> {
    try {
      const db = await getDbInstance();
      return await db.collection<MathChallengeDocument>(CHALLENGES_COLLECTION)
        .find()
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      handleDbError(error, 'getChallenges');
      return [];
    }
  },

  async getChallengeById(id: string): Promise<MathChallengeDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return null;
      return await db.collection<MathChallengeDocument>(CHALLENGES_COLLECTION)
        .findOne({ _id: new ObjectId(id) });
    } catch (error) {
      handleDbError(error, 'getChallengeById');
      return null;
    }
  },

  async createChallenge(challengeData: Omit<MathChallengeDocument, '_id' | 'created_at' | 'updated_at'>): Promise<MathChallengeDocument | null> {
    try {
      const db = await getDbInstance();
      const now = new Date();
      const newChallenge: MathChallengeDocument = {
        ...challengeData,
        created_at: now,
        updated_at: now,
      };
      const result = await db.collection<MathChallengeDocument>(CHALLENGES_COLLECTION).insertOne(newChallenge);
      if (!result.insertedId) throw new Error('Challenge creation failed');
      return { ...newChallenge, _id: result.insertedId };
    } catch (error) {
      handleDbError(error, 'createChallenge');
      return null;
    }
  },

  async updateChallenge(id: string, challengeData: Partial<Omit<MathChallengeDocument, '_id' | 'created_at' | 'updated_at'>>): Promise<MathChallengeDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return null;
      const result = await db.collection<MathChallengeDocument>(CHALLENGES_COLLECTION)
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { ...challengeData, updated_at: new Date() } },
          { returnDocument: 'after' }
        );
      return result;
    } catch (error) {
      handleDbError(error, 'updateChallenge');
      return null;
    }
  },

  async deleteChallenge(id: string): Promise<boolean> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return false;
      const result = await db.collection<MathChallengeDocument>(CHALLENGES_COLLECTION).deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      handleDbError(error, 'deleteChallenge');
      return false;
    }
  },

  async getChallengesByDifficulty(difficulty: number): Promise<MathChallengeDocument[]> {
    try {
      const db = await getDbInstance();
      return await db.collection<MathChallengeDocument>(CHALLENGES_COLLECTION)
        .find({ difficulty_level: difficulty })
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      handleDbError(error, 'getChallengesByDifficulty');
      return [];
    }
  },

  async submitAttempt(studentId: string, challengeId: string, attemptText: string, isCorrect: boolean): Promise<ChallengeAttemptDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(studentId) || !ObjectId.isValid(challengeId)) return null;
      const newAttempt: ChallengeAttemptDocument = {
        student_id: new ObjectId(studentId),
        challenge_id: new ObjectId(challengeId),
        attempt_text: attemptText,
        is_correct: isCorrect,
        attempted_at: new Date(),
      };
      const result = await db.collection<ChallengeAttemptDocument>(ATTEMPTS_COLLECTION).insertOne(newAttempt);
      if (!result.insertedId) throw new Error('Submitting attempt failed');
      return { ...newAttempt, _id: result.insertedId };
    } catch (error) {
      handleDbError(error, 'submitAttempt');
      return null;
    }
  },

  async getStudentAttempts(studentId: string): Promise<any[]> { // Consider a more specific type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(studentId)) return [];
      return await db.collection<ChallengeAttemptDocument>(ATTEMPTS_COLLECTION)
        .aggregate([
          { $match: { student_id: new ObjectId(studentId) } },
          {
            $lookup: {
              from: CHALLENGES_COLLECTION,
              localField: 'challenge_id',
              foreignField: '_id',
              as: 'challenge',
            },
          },
          { $unwind: '$challenge' },
          { $sort: { attempted_at: -1 } },
           {
            $project: {
              _id: 1, student_id: 1, challenge_id: 1, attempt_text: 1, is_correct: 1, attempted_at: 1,
              challenge: { _id: '$challenge._id', title: '$challenge.title', description: '$challenge.description', difficulty_level: '$challenge.difficulty_level' }
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getStudentAttempts');
      return [];
    }
  },

  async getChallengeAttempts(challengeId: string): Promise<any[]> { // Consider a more specific type
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(challengeId)) return [];
      return await db.collection<ChallengeAttemptDocument>(ATTEMPTS_COLLECTION)
        .aggregate([
          { $match: { challenge_id: new ObjectId(challengeId) } },
          {
            $lookup: {
              from: USERS_COLLECTION,
              localField: 'student_id',
              foreignField: '_id',
              as: 'student',
            },
          },
          { $unwind: '$student' },
          { $sort: { attempted_at: -1 } },
          {
            $project: {
              _id: 1, student_id: 1, challenge_id: 1, attempt_text: 1, is_correct: 1, attempted_at: 1,
              student: { _id: '$student._id', full_name: '$student.full_name', email: '$student.email', avatar_url: '$student.avatar_url' }
            }
          }
        ])
        .toArray();
    } catch (error) {
      handleDbError(error, 'getChallengeAttempts');
      return [];
    }
  },

  async getStudentSuccessRate(studentId: string): Promise<number> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(studentId)) return 0;
      const attempts = await db.collection<ChallengeAttemptDocument>(ATTEMPTS_COLLECTION)
        .find({ student_id: new ObjectId(studentId) })
        .project({ is_correct: 1 })
        .toArray();

      if (attempts.length === 0) return 0;
      const correctAttempts = attempts.filter(a => a.is_correct).length;
      return (correctAttempts / attempts.length) * 100;
    } catch (error) {
      handleDbError(error, 'getStudentSuccessRate');
      return 0;
    }
  },

  async getChallengeSuccessRate(challengeId: string): Promise<number> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(challengeId)) return 0;
      const attempts = await db.collection<ChallengeAttemptDocument>(ATTEMPTS_COLLECTION)
        .find({ challenge_id: new ObjectId(challengeId) })
        .project({ is_correct: 1 })
        .toArray();

      if (attempts.length === 0) return 0;
      const correctAttempts = attempts.filter(a => a.is_correct).length;
      return (correctAttempts / attempts.length) * 100;
    } catch (error) {
      handleDbError(error, 'getChallengeSuccessRate');
      return 0;
    }
  },

  async getRecentChallenges(limit: number = 5): Promise<MathChallengeDocument[]> {
    try {
      const db = await getDbInstance();
      return await db.collection<MathChallengeDocument>(CHALLENGES_COLLECTION)
        .find()
        .sort({ created_at: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      handleDbError(error, 'getRecentChallenges');
      return [];
    }
  },

  // getPopularChallenges needs re-thinking for MongoDB.
  // Supabase version used a count on a non-existent 'count' field.
  // A possible MongoDB approach is to $group by challenge_id and $sum attempts, then $sort.
  async getPopularChallenges(limit: number = 5): Promise<MathChallengeDocument[]> {
    try {
      const db = await getDbInstance();
      const popularChallengeIds = await db.collection<ChallengeAttemptDocument>(ATTEMPTS_COLLECTION)
        .aggregate([
          { $group: { _id: '$challenge_id', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: limit },
          { $project: { _id: 1 } } // Project only the challenge_id
        ])
        .map(doc => doc._id)
        .toArray();

      if (popularChallengeIds.length === 0) return [];

      return await db.collection<MathChallengeDocument>(CHALLENGES_COLLECTION)
        .find({ _id: { $in: popularChallengeIds } })
        .toArray();
    } catch (error) {
      handleDbError(error, 'getPopularChallenges');
      return [];
    }
  }
};
