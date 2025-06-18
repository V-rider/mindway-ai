
import { getCurrentSupabaseClient } from '../supabase/dynamic-client';

// Utility function to ensure hashed_password column exists and create it if missing
const ensureHashedPasswordColumn = async (tableName: string) => {
  const supabase = getCurrentSupabaseClient();
  
  try {
    // Try to select from the table with hashed_password column
    // If the column doesn't exist, this will throw an error
    const { data, error } = await supabase
      .from(tableName as any)
      .select('hashed_password')
      .limit(1);
    
    if (error && error.code === '42703') {
      console.log(`hashed_password column not found for ${tableName}, attempting to create it...`);
      
      // Try to add the column using a direct SQL query
      try {
        const { error: alterError } = await supabase.rpc('exec_sql', {
          sql: `ALTER TABLE public.${tableName} ADD COLUMN IF NOT EXISTS hashed_password TEXT;`
        });
        
        if (alterError) {
          console.error(`Failed to add hashed_password column to ${tableName}:`, alterError);
          return false;
        }
        
        // Set default values for existing records
        const { error: updateError } = await supabase.rpc('exec_sql', {
          sql: `UPDATE public.${tableName} SET hashed_password = 'temp_salt:temp_hash' WHERE hashed_password IS NULL;`
        });
        
        if (updateError) {
          console.warn(`Failed to set default values for ${tableName}:`, updateError);
        }
        
        console.log(`Successfully created hashed_password column for ${tableName}`);
        return true;
      } catch (rpcError) {
        console.warn(`Could not create column using RPC, trying alternative approach for ${tableName}:`, rpcError);
        return false;
      }
    } else if (error) {
      console.warn(`Could not check hashed_password column for ${tableName}:`, error);
      return false;
    }
    
    console.log(`hashed_password column exists for ${tableName}`);
    return true;
  } catch (error) {
    console.warn(`Could not ensure hashed_password column exists for ${tableName}:`, error);
    return false;
  }
};

// Utility function to migrate existing plain text passwords to hashed format
export const migrateStudentPasswords = async () => {
  const supabase = getCurrentSupabaseClient();
  
  console.log("Starting student password migration...");
  
  // Check if the hashed_password column exists, create if missing
  const hasColumn = await ensureHashedPasswordColumn('students');
  if (!hasColumn) {
    console.error("Could not ensure hashed_password column exists in students table");
    return;
  }
  
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
    let plainPassword = (student as any).password;
    
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
  
  // Check if the hashed_password column exists, create if missing
  const hasColumn = await ensureHashedPasswordColumn('teachers');
  if (!hasColumn) {
    console.error("Could not ensure hashed_password column exists in teachers table");
    return;
  }
  
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
    let plainPassword = (teacher as any).password;
    
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
