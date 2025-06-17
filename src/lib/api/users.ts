import { fetchApi } from './client';
import type { UserDocument } from '@/models/mongo/user';
// NOTE: Supabase auth.getUser() is specific to Supabase.
// This will need to be replaced with your MongoDB authentication strategy.
// For this refactor, getCurrentUser will be simplified or will need a new auth mechanism.

const USERS_COLLECTION = 'users';

export const userApi = {
  // getCurrentUser: This function relies on Supabase specific auth (`supabase.auth.getUser()`).
  // This needs to be replaced with your application's session/auth management for MongoDB.
  // For now, this function will be a placeholder or removed if no direct equivalent.
  // A common pattern is to get user ID from session and then fetch from DB.
  async getCurrentUser(userIdFromAuth?: string): Promise<UserDocument | null> {
    if (!userIdFromAuth) {
      console.warn("getCurrentUser called without a user ID from auth system.");
      return null;
    }
    const response = await fetchApi<UserDocument>(`/users/${userIdFromAuth}`);
    return response.data || null;
  },

  async getUserById(id: string): Promise<UserDocument | null> {
    const response = await fetchApi<UserDocument>(`/users/${id}`);
    return response.data || null;
  },

  // This should be restricted (e.g. admin only) at the application/API gateway level
  async getAllUsers(): Promise<UserDocument[]> {
    const response = await fetchApi<UserDocument[]>('/users');
    return response.data || [];
  },

    try {
      const db = await getDbInstance();
      return await db.collection<UserDocument>(USERS_COLLECTION)
        .find()
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      handleDbError(error, 'getAllUsers');
      return [];
    }
  },

  // createUser: In a real app, user creation is often part of an auth signup flow.
  // This API might be for admin creating users or a simplified direct creation.
  // Password handling is a major consideration if this is a full user record.
  // For this example, assuming `userData` does not include raw passwords.
  async createUser(userData: Omit<UserDocument, '_id' | 'created_at' | 'updated_at' | 'enrolled_class_ids'>): Promise<UserDocument | null> {
    try {
      const db = await getDbInstance();
      const now = new Date();
      const newUser: UserDocument = {
        ...userData,
        enrolled_class_ids: [],
        created_at: now,
        updated_at: now,
      };
      // Add email uniqueness check if not handled by MongoDB schema/index
      const existingUser = await db.collection<UserDocument>(USERS_COLLECTION).findOne({email: newUser.email});
      if (existingUser) {
        throw new Error("User with this email already exists.");
      }

      const result = await db.collection<UserDocument>(USERS_COLLECTION).insertOne(newUser);
      if (!result.insertedId) throw new Error('User creation failed');
      return { ...newUser, _id: result.insertedId };
    } catch (error) {
      handleDbError(error, 'createUser');
      return null;
    }
  },

  async updateUser(id: string, userData: Partial<Omit<UserDocument, '_id' | 'created_at' | 'updated_at'>>): Promise<UserDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return null;

      // Prevent email change to one that already exists for another user
      if (userData.email) {
        const existingUser = await db.collection<UserDocument>(USERS_COLLECTION).findOne({email: userData.email, _id: {$ne: new ObjectId(id)} });
        if (existingUser) {
          throw new Error("Another user with this email already exists.");
        }
      }

      const result = await db.collection<UserDocument>(USERS_COLLECTION)
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { ...userData, updated_at: new Date() } },
          { returnDocument: 'after' }
        );
      return result;
    } catch (error) {
      handleDbError(error, 'updateUser');
      return null;
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return false;
      // Consider cascading deletes or handling related data (e.g., reassign classes if teacher, remove enrollments if student)
      const result = await db.collection<UserDocument>(USERS_COLLECTION).deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      handleDbError(error, 'deleteUser');
      return false;
    }
  },

  async getUsersByRole(role: UserDocument['role']): Promise<UserDocument[]> {
    try {
      const db = await getDbInstance();
      return await db.collection<UserDocument>(USERS_COLLECTION)
        .find({ role: role })
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      handleDbError(error, 'getUsersByRole');
      return [];
    }
  },

  async updateUserAvatar(id: string, avatarUrl: string): Promise<UserDocument | null> {
    try {
      const db = await getDbInstance();
      if (!ObjectId.isValid(id)) return null;
      const result = await db.collection<UserDocument>(USERS_COLLECTION)
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { avatar_url: avatarUrl, updated_at: new Date() } },
          { returnDocument: 'after' }
        );
      return result;
    } catch (error) {
      handleDbError(error, 'updateUserAvatar');
      return null;
    }
  }
};
