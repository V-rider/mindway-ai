
import { PROJECT_CONFIGS } from '@/config/projects';
import { createProjectClient, checkHashedPasswordColumn, hashPasswordWithEdgeFunction } from './shared';

// Utility function to migrate existing plain text passwords to hashed format for students
export const migrateStudentPasswords = async (projectName?: string) => {
  const projectsToMigrate = projectName 
    ? PROJECT_CONFIGS.filter(p => p.projectName === projectName)
    : PROJECT_CONFIGS;

  for (const projectConfig of projectsToMigrate) {
    const supabase = createProjectClient(projectConfig);
    
    console.log(`Starting student password migration for ${projectConfig.projectName}...`);
    
    try {
      // Check if hashed_password column exists
      const hasHashedPasswordColumn = await checkHashedPasswordColumn(supabase, 'students', projectConfig.projectName);
      if (!hasHashedPasswordColumn) {
        console.error(`Skipping student migration for ${projectConfig.projectName} - hashed_password column missing`);
        continue;
      }

      // Get all students with temporary hashes
      const { data: students, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('hashed_password', 'temp_salt:temp_hash');

      if (fetchError) {
        console.error(`Error fetching students for ${projectConfig.projectName}:`, fetchError);
        continue;
      }

      console.log(`Found ${students?.length || 0} students to migrate in ${projectConfig.projectName}`);

      // Known passwords for the sample data based on the migration files
      const knownPasswords: Record<string, string> = {
        'gay.jasper@cfss.edu.hk': 'P9mK2xL4',
        'student@example.com': 'password',
        'jane@example.com': 'password'
      };

      if (!students || students.length === 0) {
        console.log(`No students found with temporary passwords in ${projectConfig.projectName}`);
        continue;
      }

      // Process each student
      for (const student of students) {
        const plainPassword = knownPasswords[student.email];
        
        if (!plainPassword) {
          console.warn(`No known password for ${student.email} in ${projectConfig.projectName}, skipping...`);
          continue;
        }

        try {
          console.log(`Attempting to hash password for student: ${student.email} in ${projectConfig.projectName}`);
          
          // Hash the password using the Edge Function
          const hashedPassword = await hashPasswordWithEdgeFunction(supabase, plainPassword, projectConfig.projectName);

          console.log(`Successfully hashed password for ${student.email} in ${projectConfig.projectName}, updating database...`);

          // Update the student record with the hashed password
          const { error: updateError } = await supabase
            .from('students')
            .update({ hashed_password: hashedPassword })
            .eq('sid', student.sid);

          if (updateError) {
            console.error(`Error updating password for ${student.email} in ${projectConfig.projectName}:`, updateError);
          } else {
            console.log(`Successfully migrated password for ${student.email} in ${projectConfig.projectName}`);
          }
        } catch (error) {
          console.error(`Unexpected error migrating ${student.email} in ${projectConfig.projectName}:`, error);
        }
      }

      console.log(`Student password migration completed for ${projectConfig.projectName}`);
    } catch (error) {
      console.error(`Student password migration failed for ${projectConfig.projectName}:`, error);
    }
  }
};
