
import { supabase } from '@/integrations/supabase/client';

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-password', {
      body: {
        password: plainPassword,
        hashedPassword: hashedPassword
      }
    });

    if (error) {
      console.error('Password verification error:', error);
      return false;
    }

    return data?.isValid || false;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
};
