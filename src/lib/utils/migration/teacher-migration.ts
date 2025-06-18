
import { PROJECT_CONFIGS } from '@/config/projects';
import { createProjectClient, checkHashedPasswordColumn, hashPasswordWithEdgeFunction } from './shared';

// Enhanced function for teachers including CFSS and MAX teachers
export const migrateTeacherPasswords = async (projectName?: string) => {
  const projectsToMigrate = projectName 
    ? PROJECT_CONFIGS.filter(p => p.projectName === projectName)
    : PROJECT_CONFIGS;

  for (const projectConfig of projectsToMigrate) {
    const supabase = createProjectClient(projectConfig);
    
    console.log(`Starting teacher password migration for ${projectConfig.projectName}...`);
    
    try {
      // Check if hashed_password column exists
      const hasHashedPasswordColumn = await checkHashedPasswordColumn(supabase, 'teachers', projectConfig.projectName);
      if (!hasHashedPasswordColumn) {
        console.error(`Skipping teacher migration for ${projectConfig.projectName} - hashed_password column missing`);
        continue;
      }

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
          const hashedPassword = await hashPasswordWithEdgeFunction(supabase, plainPassword, projectConfig.projectName);

          console.log(`Successfully hashed password for ${teacher.email} in ${projectConfig.projectName}, updating database...`);

          // Update the teacher record with the hashed password
          const { error: updateError } = await supabase
            .from('teachers')
            .update({ hashed_password: hashedPassword })
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
