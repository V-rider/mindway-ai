
import { migrateStudentPasswords } from './migration/student-migration';
import { migrateTeacherPasswords } from './migration/teacher-migration';

// Function to migrate passwords for a specific project
export const migrateProjectPasswords = async (projectName: string) => {
  console.log(`Starting password migration for ${projectName}...`);
  await migrateStudentPasswords(projectName);
  await migrateTeacherPasswords(projectName);
  console.log(`Password migration completed for ${projectName}`);
};

// Function to migrate passwords for all projects
export const migrateAllProjectPasswords = async () => {
  console.log("Starting password migration for all projects...");
  await migrateStudentPasswords();
  await migrateTeacherPasswords();
  console.log("Password migration completed for all projects");
};

// Re-export the individual migration functions for direct use
export { migrateStudentPasswords } from './migration/student-migration';
export { migrateTeacherPasswords } from './migration/teacher-migration';
