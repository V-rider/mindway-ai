
import { getCurrentSupabaseClient } from '../supabase/dynamic-client';

// Utility function to migrate existing plain text passwords to hashed format
export const migrateStudentPasswords = async () => {
  const supabase = getCurrentSupabaseClient();
  
  console.log("Starting student password migration...");
  
  // Get all students with temporary hashes or null hashed passwords
  const { data: students, error: fetchError } = await supabase
    .from('students')
    .select('*')
    .or('hashed_password.eq.temp_salt:temp_hash,hashed_password.is.null');

  if (fetchError) {
    console.error("Error fetching students:", fetchError);
    return;
  }

  console.log(`Found ${students?.length || 0} students to migrate`);

  if (!students || students.length === 0) {
    console.log("No students found with temporary passwords");
    return;
  }

  // Process each student - use their existing password column value
  for (const student of students) {
    // For MAX project, use the existing password column directly
    // For CFSS project, may need known passwords if password column doesn't exist
    let plainPassword = student.password;
    
    // Fallback to known passwords if no password column exists (CFSS case)
    if (!plainPassword) {
      const knownPasswords: Record<string, string> = {
        'gay.jasper@cfss.edu.hk': 'P9mK2xL4',
        'student@example.com': 'password',
        'jane@example.com': 'password'
      };
      plainPassword = knownPasswords[student.email];
    }
    
    if (!plainPassword) {
      console.warn(`No password found for ${student.email}, skipping...`);
      continue;
    }

    try {
      console.log(`Attempting to hash password for student: ${student.email}`);
      
      // Hash the password using the Edge Function
      const { data: hashResult, error: hashError } = await supabase.functions.invoke('auth-password', {
        body: {
          action: 'hash',
          password: plainPassword
        }
      });

      if (hashError) {
        console.error(`Error hashing password for ${student.email}:`, hashError);
        continue;
      }

      console.log(`Successfully hashed password for ${student.email}, updating database...`);

      // Update the student record with the hashed password
      const { error: updateError } = await supabase
        .from('students')
        .update({ hashed_password: hashResult.hashedPassword })
        .eq('sid', student.sid);

      if (updateError) {
        console.error(`Error updating password for ${student.email}:`, updateError);
      } else {
        console.log(`Successfully migrated password for ${student.email}`);
      }
    } catch (error) {
      console.error(`Unexpected error migrating ${student.email}:`, error);
    }
  }

  console.log("Student password migration completed");
};

// Enhanced function for teachers including both CFSS and MAX teachers
export const migrateTeacherPasswords = async () => {
  const supabase = getCurrentSupabaseClient();
  
  console.log("Starting teacher password migration...");
  
  // Get all teachers that need migration (either temp hash or no hashed_password)
  const { data: teachers, error: fetchError } = await supabase
    .from('teachers')
    .select('*')
    .or('hashed_password.eq.temp_salt:temp_hash,hashed_password.is.null');

  if (fetchError) {
    console.error("Error fetching teachers:", fetchError);
    return;
  }

  console.log(`Found ${teachers?.length || 0} teachers to migrate`);

  if (!teachers || teachers.length === 0) {
    console.log("No teachers found that need migration");
    return;
  }

  // Process each teacher
  for (const teacher of teachers) {
    // For both CFSS and MAX teachers, use their existing password column value
    let plainPassword = teacher.password;
    
    console.log(`Processing teacher: ${teacher.email} with password from DB`);
    
    if (!plainPassword) {
      console.warn(`No password found for ${teacher.email}, skipping...`);
      continue;
    }

    try {
      console.log(`Attempting to hash password for ${teacher.email}`);
      
      // Hash the password using the Edge Function
      const { data: hashResult, error: hashError } = await supabase.functions.invoke('auth-password', {
        body: {
          action: 'hash',
          password: plainPassword
        }
      });

      if (hashError) {
        console.error(`Error hashing password for ${teacher.email}:`, hashError);
        continue;
      }

      console.log(`Successfully hashed password for ${teacher.email}, updating database...`);

      // Update the teacher record with the hashed password
      const { error: updateError } = await supabase
        .from('teachers')
        .update({ hashed_password: hashResult.hashedPassword })
        .eq('email', teacher.email);

      if (updateError) {
        console.error(`Error updating password for ${teacher.email}:`, updateError);
      } else {
        console.log(`Successfully migrated password for ${teacher.email}`);
      }
    } catch (error) {
      console.error(`Unexpected error migrating ${teacher.email}:`, error);
    }
  }

  console.log("Teacher password migration completed");
};
