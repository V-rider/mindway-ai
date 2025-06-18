
import { supabase } from '@/integrations/supabase/client';
import { PasswordUtils } from '@/lib/auth/password-utils';

/**
 * Migration script to hash existing plain text passwords
 * This should be run once to convert all existing passwords to hashed format
 */
export async function hashExistingPasswords() {
  console.log('Starting password hashing migration...');
  
  try {
    // Hash all student passwords
    console.log('Processing student passwords...');
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('sid, email, password, hashed_password')
      .is('hashed_password', null); // Only get records without hashed passwords

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
      return;
    }

    console.log(`Found ${students?.length || 0} students with unhashed passwords`);

    if (students && students.length > 0) {
      for (const student of students) {
        try {
          const hashedPassword = await PasswordUtils.hashPassword(student.password);
          
          const { error: updateError } = await supabase
            .from('students')
            .update({ hashed_password: hashedPassword })
            .eq('sid', student.sid);

          if (updateError) {
            console.error(`Error updating student ${student.email}:`, updateError);
          } else {
            console.log(`✓ Hashed password for student: ${student.email}`);
          }
        } catch (error) {
          console.error(`Error hashing password for student ${student.email}:`, error);
        }
      }
    }

    // Hash all teacher passwords
    console.log('Processing teacher passwords...');
    const { data: teachers, error: teachersError } = await supabase
      .from('teachers')
      .select('email, password, hashed_password')
      .is('hashed_password', null); // Only get records without hashed passwords

    if (teachersError) {
      console.error('Error fetching teachers:', teachersError);
      return;
    }

    console.log(`Found ${teachers?.length || 0} teachers with unhashed passwords`);

    if (teachers && teachers.length > 0) {
      for (const teacher of teachers) {
        try {
          const hashedPassword = await PasswordUtils.hashPassword(teacher.password);
          
          const { error: updateError } = await supabase
            .from('teachers')
            .update({ hashed_password: hashedPassword })
            .eq('email', teacher.email);

          if (updateError) {
            console.error(`Error updating teacher ${teacher.email}:`, updateError);
          } else {
            console.log(`✓ Hashed password for teacher: ${teacher.email}`);
          }
        } catch (error) {
          console.error(`Error hashing password for teacher ${teacher.email}:`, error);
        }
      }
    }

    console.log('Password hashing migration completed successfully!');
    
    // Return summary
    return {
      studentsProcessed: students?.length || 0,
      teachersProcessed: teachers?.length || 0,
      success: true
    };

  } catch (error) {
    console.error('Migration failed:', error);
    return {
      studentsProcessed: 0,
      teachersProcessed: 0,
      success: false,
      error: error
    };
  }
}

// Auto-run the migration if this file is executed directly
if (typeof window !== 'undefined') {
  console.log('Password hashing script loaded. Call hashExistingPasswords() to run the migration.');
}
