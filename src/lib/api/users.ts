
import { fetchApi } from './client';
import type { UserDocument } from '@/models/mongo/user';

export const userApi = {
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

  async getAllUsers(): Promise<UserDocument[]> {
    const response = await fetchApi<UserDocument[]>('/users');
    return response.data || [];
  },

  async createUser(userData: Omit<UserDocument, '_id' | 'created_at' | 'updated_at' | 'enrolled_class_ids'>): Promise<UserDocument | null> {
    const response = await fetchApi<UserDocument>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data || null;
  },

  async updateUser(id: string, userData: Partial<Omit<UserDocument, '_id' | 'created_at' | 'updated_at'>>): Promise<UserDocument | null> {
    const response = await fetchApi<UserDocument>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data || null;
  },

  async deleteUser(id: string): Promise<boolean> {
    const response = await fetchApi<{ success: boolean }>(`/users/${id}`, {
      method: 'DELETE',
    });
    return response.data?.success || false;
  },

  async getUsersByRole(role: UserDocument['role']): Promise<UserDocument[]> {
    const response = await fetchApi<UserDocument[]>(`/users?role=${role}`);
    return response.data || [];
  },

  async updateUserAvatar(id: string, avatarUrl: string): Promise<UserDocument | null> {
    const response = await fetchApi<UserDocument>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ avatar_url: avatarUrl }),
    });
    return response.data || null;
  }
};
