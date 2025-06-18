
import { useApi } from '../useApi';
import { studentService, StudentData } from '@/services/data/studentService';

export const useStudents = () => {
  const { createQuery } = useApi();

  return createQuery(
    ['students'],
    () => studentService.getAllStudents(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useStudent = (studentId: string) => {
  const { createQuery } = useApi();

  return createQuery(
    ['student', studentId],
    () => studentService.getStudentById(studentId),
    {
      enabled: !!studentId,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useStudentProgress = (studentId: string) => {
  const { createQuery } = useApi();

  return createQuery(
    ['student-progress', studentId],
    () => studentService.getStudentProgress(studentId),
    {
      enabled: !!studentId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
};
