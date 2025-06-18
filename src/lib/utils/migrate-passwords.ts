
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { PROJECT_CONFIGS } from '@/config/projects';

// Create clients for each project
const createProjectClient = (projectConfig: typeof PROJECT_CONFIGS[0]) => {
  return createClient<Database>(
    projectConfig.supabaseUrl,
    projectConfig.supabaseAnonKey,
    {
      auth: {
        storage: localStorage,
        persistSession: false, // Don't persist session for migration utility
        autoRefreshToken: false,
      }
    }
  );
};

// Utility function to migrate existing plain text passwords to hashed format for a specific project
export const migrateStudentPasswords = async (projectName?: string) => {
  const projectsToMigrate = projectName 
    ? PROJECT_CONFIGS.filter(p => p.projectName === projectName)
    : PROJECT_CONFIGS;

  for (const projectConfig of projectsToMigrate) {
    const supabase = createProjectClient(projectConfig);
    
    console.log(`Starting student password migration for ${projectConfig.projectName}...`);
    
    try {
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
          const { data: hashResult, error: hashError } = await supabase.functions.invoke('auth-password', {
            body: {
              action: 'hash',
              password: plainPassword
            }
          });

          if (hashError) {
            console.error(`Error hashing password for ${student.email} in ${projectConfig.projectName}:`, hashError);
            continue;
          }

          console.log(`Successfully hashed password for ${student.email} in ${projectConfig.projectName}, updating database...`);

          // Update the student record with the hashed password
          const { error: updateError } = await supabase
            .from('students')
            .update({ hashed_password: hashResult.hashedPassword })
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

// Enhanced function for teachers including CFSS and MAX teachers
export const migrateTeacherPasswords = async (projectName?: string) => {
  const projectsToMigrate = projectName 
    ? PROJECT_CONFIGS.filter(p => p.projectName === projectName)
    : PROJECT_CONFIGS;

  for (const projectConfig of projectsToMigrate) {
    const supabase = createProjectClient(projectConfig);
    
    console.log(`Starting teacher password migration for ${projectConfig.projectName}...`);
    
    try {
      // Get all teachers that need migration (either temp hash or no hashed_password)
      const { data: teachers, error: fetchError } = await supabase
        .from('teachers')
        .select('*')
        .or('hashed_password.eq.temp_salt:temp_hash,hashed_password.is.null');

      if (fetchError) {
        console.error(`Error fetching teachers for ${projectConfig.projectName}:`, fetchError);
        continue;
      }

      console.log(`Found ${teachers?.length || 0} teachers to migrate in ${projectConfig.projectName}`);

      if (!teachers || teachers.length === 0) {
        console.log(`No teachers found that need migration in ${projectConfig.projectName}`);
        continue;
      }

      // Process each teacher
      for (const teacher of teachers) {
        // For teachers, use their existing password column value
        let plainPassword = teacher.password;
        
        console.log(`Processing teacher: ${teacher.email} with password from DB in ${projectConfig.projectName}`);
        
        if (!plainPassword) {
          console.warn(`No password found for ${teacher.email} in ${projectConfig.projectName}, skipping...`);
          continue;
        }

        try {
          console.log(`Attempting to hash password for ${teacher.email} in ${projectConfig.projectName}`);
          
          // Hash the password using the Edge Function
          const { data: hashResult, error: hashError } = await supabase.functions.invoke('auth-password', {
            body: {
              action: 'hash',
              password: plainPassword
            }
          });

          if (hashError) {
            console.error(`Error hashing password for ${teacher.email} in ${projectConfig.projectName}:`, hashError);
            continue;
          }

          console.log(`Successfully hashed password for ${teacher.email} in ${projectConfig.projectName}, updating database...`);

          // Update the teacher record with the hashed password
          const { error: updateError } = await supabase
            .from('teachers')
            .update({ hashed_password: hashResult.hashedPassword })
            .eq('email', teacher.email);

          if (updateError) {
            console.error(`Error updating password for ${teacher.email} in ${projectConfig.projectName}:`, updateError);
          } else {
            console.log(`Successfully migrated password for ${teacher.email} in ${projectConfig.projectName}`);
          }
        } catch (error) {
          console.error(`Unexpected error migrating ${teacher.email} in ${projectConfig.projectName}:`, error);
        }
      }

      console.log(`Teacher password migration completed for ${projectConfig.projectName}`);
    } catch (error) {
      console.error(`Teacher password migration failed for ${projectConfig.projectName}:`, error);
    }
  }
};

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
