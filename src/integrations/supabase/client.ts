// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lhnxnfpnkkeejsinxecf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnhuZnBua2tlZWpzaW54ZWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTA0OTcsImV4cCI6MjA2NTcyNjQ5N30.e0KElISEVvvgookyv4dikFrgDcj7PC1qY7zDsRrS0A4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);