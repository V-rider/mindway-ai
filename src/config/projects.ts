
export interface ProjectConfig {
  domain: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  projectName: string;
}

export const PROJECT_CONFIGS: ProjectConfig[] = [
  {
    domain: "cfss.edu.hk",
    supabaseUrl: "https://lhnxnfpnkkeejsinxecf.supabase.co",
    supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnhuZnBua2tlZWpzaW54ZWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTA0OTcsImV4cCI6MjA2NTcyNjQ5N30.e0KElISEVvvgookyv4dikFrgDcj7PC1qY7zDsRrS0A4",
    projectName: "CFSS"
  },
  {
    domain: "max.edu.hk",
    supabaseUrl: "https://eypvrfvszxoicyzlihhe.supabase.co",
    supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cHZyZnZzenhvaWN5emxpaGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTcwNTgsImV4cCI6MjA2NTc5MzA1OH0.HAvOtr6razZ2-9e_YiFI1cpDkrKl6FodHPSpmvgFkuQ",
    projectName: "MAX"
  }
];

export const getProjectByDomain = (email: string): ProjectConfig | null => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return null;
  
  return PROJECT_CONFIGS.find(config => config.domain === domain) || null;
};

export const getProjectByUrl = (url: string): ProjectConfig | null => {
  return PROJECT_CONFIGS.find(config => config.supabaseUrl === url) || null;
};
