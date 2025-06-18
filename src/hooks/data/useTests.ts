
import { useApi } from '../useApi';
import { testService, TestData } from '@/services/data/testService';

export const useTests = () => {
  const { createQuery } = useApi();

  return createQuery(
    ['tests'],
    () => testService.getAllTests(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useTest = (testId: string) => {
  const { createQuery } = useApi();

  return createQuery(
    ['test', testId],
    () => testService.getTestById(testId),
    {
      enabled: !!testId,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useTestResults = (testId: string) => {
  const { createQuery } = useApi();

  return createQuery(
    ['test-results', testId],
    () => testService.getTestResults(testId),
    {
      enabled: !!testId,
      staleTime: 2 * 60 * 1000,
    }
  );
};
