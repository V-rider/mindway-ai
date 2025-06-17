import { getDbInstance, handleDbError } from '@/lib/supabase/client'; // Changed path if necessary, or alias
import { ObjectId } from 'mongodb';
import type {
  AchievementDocument
} from '@/models/mongo/achievement'; // Import MongoDB specific types
import type {
  StudentAchievementDocument
} from '@/models/mongo/student_achievement';
// We'll need UserDocument if we populate user details, and AchievementDocument for achievement details
import type { UserDocument } from '@/models/mongo/user';


// Define collection names - good practice to centralize these if used in many places
const ACHIEVEMENTS_COLLECTION = 'achievements';
const STUDENT_ACHIEVEMENTS_COLLECTION = 'studentAchievements';
const USERS_COLLECTION = 'users';


export const achievementApi = {
  // Get all achievements
  async getAchievements(): Promise<AchievementDocument[]> {
    try {
      const db = await getDbInstance();
      const achievements = await db
        .collection<AchievementDocument>(ACHIEVEMENTS_COLLECTION)
        .find()
        .sort({ created_at: -1 }) // -1 for descending
        .toArray();
      return achievements;
    } catch (error) {
      handleDbError(error, 'getAchievements');
      return []; // Or rethrow, depending on desired error handling
    }
  },

  // Get achievement by ID
  async getAchievementById(id: string): Promise<AchievementDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) {
        console.warn('Invalid ObjectId for getAchievementById:', id);
        return null; // Or throw error
      }
      const achievement = await db
        .collection<AchievementDocument>(ACHIEVEMENTS_COLLECTION)
        .findOne({ _id: new ObjectId(id) });
      return achievement;
    } catch (error) {
      handleDbError(error, 'getAchievementById');
      return null; // Or rethrow
    }
  },

  // Create new achievement
  async createAchievement(achievementData: Omit<AchievementDocument, '_id' | 'created_at'>): Promise<AchievementDocument | null> {
    try {
      const db = await getDbInstance();
      const newAchievement: AchievementDocument = {
        ...achievementData,
        created_at: new Date(),
      };
      const result = await db
        .collection<AchievementDocument>(ACHIEVEMENTS_COLLECTION)
        .insertOne(newAchievement);

      if (!result.insertedId) {
        throw new Error('Achievement creation failed');
      }
      // Return the inserted document, including the _id and created_at
      return { ...newAchievement, _id: result.insertedId };
    } catch (error) {
      handleDbError(error, 'createAchievement');
      return null; // Or rethrow
    }
  },

  // Update achievement
  async updateAchievement(id: string, achievementData: Partial<Omit<AchievementDocument, '_id' | 'created_at'>>): Promise<AchievementDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) {
        console.warn('Invalid ObjectId for updateAchievement:', id);
        return null;
      }
      const result = await db
        .collection<AchievementDocument>(ACHIEVEMENTS_COLLECTION)
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: achievementData },
          { returnDocument: 'after' } // Returns the updated document
        );
      return result;
    } catch (error) {
      handleDbError(error, 'updateAchievement');
      return null;
    }
  },

  // Delete achievement
  async deleteAchievement(id: string): Promise<boolean> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) {
        console.warn('Invalid ObjectId for deleteAchievement:', id);
        return false;
      }
      const result = await db
        .collection<AchievementDocument>(ACHIEVEMENTS_COLLECTION)
        .deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      handleDbError(error, 'deleteAchievement');
      return false;
    }
  },

  // Award achievement to student
  async awardAchievement(studentId: string, achievementId: string): Promise<StudentAchievementDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(studentId) || !ObjectId.isValid(achievementId)) {
         console.warn('Invalid ObjectId for awardAchievement');
         return null;
      }
      const newStudentAchievement: StudentAchievementDocument = {
        student_id: new ObjectId(studentId),
        achievement_id: new ObjectId(achievementId),
        earned_at: new Date(),
      };
      const result = await db
        .collection<StudentAchievementDocument>(STUDENT_ACHIEVEMENTS_COLLECTION)
        .insertOne(newStudentAchievement);

      if (!result.insertedId) {
        throw new Error('Awarding achievement failed');
      }
      return { ...newStudentAchievement, _id: result.insertedId };
    } catch (error) {
      handleDbError(error, 'awardAchievement');
      return null;
    }
  },

  // Remove achievement from student
  async removeAchievement(studentId: string, achievementId: string): Promise<boolean> {
    try {
      const db = await getDbInstance();
       if (!ObjectId.isValid(studentId) || !ObjectId.isValid(achievementId)) {
         console.warn('Invalid ObjectId for removeAchievement');
         return false;
      }
      const result = await db
        .collection<StudentAchievementDocument>(STUDENT_ACHIEVEMENTS_COLLECTION)
        .deleteOne({
          student_id: new ObjectId(studentId),
          achievement_id: new ObjectId(achievementId),
        });
      return result.deletedCount === 1;
    } catch (error) {
      handleDbError(error, 'removeAchievement');
      return false;
    }
  },

  // Get student achievements (with achievement details)
  async getStudentAchievements(studentId: string): Promise<AchievementDocument[]> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(studentId)) {
        console.warn('Invalid ObjectId for getStudentAchievements:', studentId);
        return [];
      }
      const studentAchievements = await db
        .collection<StudentAchievementDocument>(STUDENT_ACHIEVEMENTS_COLLECTION)
        .aggregate([
          { $match: { student_id: new ObjectId(studentId) } },
          {
            $lookup: {
              from: ACHIEVEMENTS_COLLECTION,
              localField: 'achievement_id',
              foreignField: '_id',
              as: 'achievementDetails',
            },
          },
          { $unwind: '$achievementDetails' }, // Deconstructs the array field from the $lookup
          { $replaceRoot: { newRoot: '$achievementDetails' } }, // Promotes achievementDetails to the root
          { $sort: { earned_at: -1 } } // This sort might be on student_achievements.earned_at before lookup
        ])
        .toArray();
      return studentAchievements as AchievementDocument[];
    } catch (error) {
      handleDbError(error, 'getStudentAchievements');
      return [];
    }
  },

  // Get achievement recipients (with student details)
  async getAchievementRecipients(achievementId: string): Promise<UserDocument[]> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(achievementId)) {
         console.warn('Invalid ObjectId for getAchievementRecipients');
         return [];
      }
      const recipients = await db
        .collection<StudentAchievementDocument>(STUDENT_ACHIEVEMENTS_COLLECTION)
        .aggregate([
          { $match: { achievement_id: new ObjectId(achievementId) } },
          {
            $lookup: {
              from: USERS_COLLECTION, // Assuming 'users' is the name of the users collection
              localField: 'student_id',
              foreignField: '_id',
              as: 'studentDetails',
            },
          },
          { $unwind: '$studentDetails' },
          { $replaceRoot: { newRoot: '$studentDetails' } },
          { $sort: { earned_at: -1 } } // Similar to above, sort might need adjustment
        ])
        .toArray();
      return recipients as UserDocument[];
    } catch (error) {
      handleDbError(error, 'getAchievementRecipients');
      return [];
    }
  },

  // Check if student has achievement
  async hasAchievement(studentId: string, achievementId: string): Promise<boolean> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(studentId) || !ObjectId.isValid(achievementId)) {
         console.warn('Invalid ObjectId for hasAchievement');
         return false;
      }
      const count = await db
        .collection<StudentAchievementDocument>(STUDENT_ACHIEVEMENTS_COLLECTION)
        .countDocuments({
          student_id: new ObjectId(studentId),
          achievement_id: new ObjectId(achievementId),
        });
      return count > 0;
    } catch (error) {
      // PGRST116 "no rows returned" is not an error for a boolean check, it means false.
      // MongoDB countDocuments returns 0 if no match, error for other issues.
      handleDbError(error, 'hasAchievement');
      return false;
    }
  },

  // Get all student achievements with details (StudentAchievement, User, Achievement)
  async getAllStudentAchievements(): Promise<any[]> { // Define a more specific return type
    try {
      const db = await getDbInstance();
      const allStudentAchievements = await db
        .collection<StudentAchievementDocument>(STUDENT_ACHIEVEMENTS_COLLECTION)
        .aggregate([
          {
            $lookup: {
              from: USERS_COLLECTION,
              localField: 'student_id',
              foreignField: '_id',
              as: 'student',
            },
          },
          { $unwind: '$student' },
          {
            $lookup: {
              from: ACHIEVEMENTS_COLLECTION,
              localField: 'achievement_id',
              foreignField: '_id',
              as: 'achievement',
            },
          },
          { $unwind: '$achievement' },
          { $sort: { earned_at: -1 } },
          // Optionally project to a specific shape
          {
            $project: {
              _id: 1, // or 0 to exclude
              student_id: 1,
              achievement_id: 1,
              earned_at: 1,
              student: { // Project specific student fields
                _id: '$student._id',
                full_name: '$student.full_name',
                email: '$student.email',
                avatar_url: '$student.avatar_url'
              },
              achievement: { // Project specific achievement fields
                _id: '$achievement._id',
                title: '$achievement.title',
                description: '$achievement.description',
                criteria: '$achievement.criteria',
                badge_url: '$achievement.badge_url'
              }
            }
          }
        ])
        .toArray();
      return allStudentAchievements;
    } catch (error) {
      handleDbError(error, 'getAllStudentAchievements');
      return [];
    }
  }
};
