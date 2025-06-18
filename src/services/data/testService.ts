
import { apiClient, ApiError } from '@/lib/api/base';

export interface TestData {
  id: string;
  name: string;
  date: string;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

export interface TestResult {
  studentId: string;
  name: string;
  score: number;
  predictedScore?: number;
  areas: string[];
}

export const testService = {
  async getAllTests(): Promise<TestData[]> {
    try {
      return await apiClient.get('tests');
    } catch (error) {
      throw new ApiError('Failed to fetch tests');
    }
  },

  async getTestById(id: string): Promise<TestData | null> {
    try {
      const tests = await apiClient.get('tests');
      return tests.find((t: TestData) => t.id === id) || null;
    } catch (error) {
      throw new ApiError('Failed to fetch test');
    }
  },

  async getTestResults(testId: string): Promise<TestResult[]> {
    try {
      return await apiClient.get('test_results', {
        select: '*',
        filter: { test_id: testId }
      });
    } catch (error) {
      throw new ApiError('Failed to fetch test results');
    }
  }
};
