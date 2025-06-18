
import { getCurrentSupabaseClient } from '../supabase/dynamic-client';

// Utility function to migrate existing plain text passwords to hashed format
export const migrateStudentPasswords = async () => {
  const supabase = getCurrentSupabaseClient();
  
  console.log("Starting student password migration...");
  
  // Get all students with temporary hashes
  const { data: students, error: fetchError } = await supabase
    .from('students')
    .select('*')
    .eq('hashed_password', 'temp_salt:temp_hash');

  if (fetchError) {
    console.error("Error fetching students:", fetchError);
    return;
  }

  console.log(`Found ${students?.length || 0} students to migrate`);

  // Known passwords for the sample data based on the migration files
  const knownPasswords: Record<string, string> = {
    'gay.jasper@cfss.edu.hk': 'P9mK2xL4',
    'student@example.com': 'password',
    'jane@example.com': 'password'
  };

  if (!students || students.length === 0) {
    console.log("No students found with temporary passwords");
    return;
  }

  // Process each student
  for (const student of students) {
    const plainPassword = knownPasswords[student.email];
    
    if (!plainPassword) {
      console.warn(`No known password for ${student.email}, skipping...`);
      continue;
    }

    try {
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

// Similar function for teachers
export const migrateTeacherPasswords = async () => {
  const supabase = getCurrentSupabaseClient();
  
  console.log("Starting teacher password migration...");
  
  // Get all teachers with temporary hashes OR bcrypt hashes that need to be converted
  const { data: teachers, error: fetchError } = await supabase
    .from('teachers')
    .select('*')
    .or('hashed_password.eq.temp_salt:temp_hash,hashed_password.like.$2%');

  if (fetchError) {
    console.error("Error fetching teachers:", fetchError);
    return;
  }

  console.log(`Found ${teachers?.length || 0} teachers to migrate`);

  // Known passwords for teachers - including CFSS teachers
  const knownPasswords: Record<string, string> = {
    'admin@example.com': 'password',
    'teacher@example.com': 'password',
    // Add CFSS teacher passwords here when known
    // 'teacher@cfss.edu.hk': 'their_password'
  };

  if (!teachers || teachers.length === 0) {
    console.log("No teachers found that need migration");
    return;
  }

  // Process each teacher
  for (const teacher of teachers) {
    // For CFSS teachers, we'll use their existing plain text password from the password column
    let plainPassword = knownPasswords[teacher.email];
    
    // If this is a CFSS teacher (domain check) and we don't have a known password, 
    // use their existing password column value
    if (!plainPassword && teacher.email.includes('@cfss.edu.hk')) {
      plainPassword = teacher.password;
      console.log(`Using existing password column for CFSS teacher: ${teacher.email}`);
    }
    
    if (!plainPassword) {
      console.warn(`No known password for ${teacher.email}, skipping...`);
      continue;
    }

    try {
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
