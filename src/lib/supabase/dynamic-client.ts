import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { ProjectConfig, getProjectByDomain } from '@/config/projects';

class DynamicSupabaseClient {
  private clients: Map<string, SupabaseClient<Database>> = new Map();
  private currentClient: SupabaseClient<Database> | null = null;
  private currentProject: ProjectConfig | null = null;

  // Create or get a client for a specific project
  getClient(config: ProjectConfig): SupabaseClient<Database> {
    const key = config.supabaseUrl;
    
    if (!this.clients.has(key)) {
      const client = createClient<Database>(
        config.supabaseUrl,
        config.supabaseAnonKey,
        {
          auth: {
            storage: localStorage,
            persistSession: true,
            autoRefreshToken: true,
          }
        }
      );
      this.clients.set(key, client);
    }
    
    return this.clients.get(key)!;
  }

  // Switch to a specific project
  switchToProject(config: ProjectConfig): SupabaseClient<Database> {
    this.currentClient = this.getClient(config);
    this.currentProject = config;
    
    // Store current project info in localStorage for persistence
    localStorage.setItem('currentProject', JSON.stringify({
      domain: config.domain,
      projectName: config.projectName,
      supabaseUrl: config.supabaseUrl
    }));
    
    return this.currentClient;
  }

  // Get client by email domain
  getClientByEmail(email: string): SupabaseClient<Database> | null {
    const config = getProjectByDomain(email);
    if (!config) return null;
    
    return this.switchToProject(config);
  }

  // Get current active client
  getCurrentClient(): SupabaseClient<Database> | null {
    return this.currentClient;
  }

  // Get current project config
  getCurrentProject(): ProjectConfig | null {
    return this.currentProject;
  }

  // Initialize from stored session
  initializeFromStorage(): SupabaseClient<Database> | null {
    const storedProject = localStorage.getItem('currentProject');
    if (!storedProject) return null;

    try {
      const projectInfo = JSON.parse(storedProject);
      const config = getProjectByDomain(`user@${projectInfo.domain}`);
      if (config) {
        return this.switchToProject(config);
      }
    } catch (error) {
      console.error('Failed to restore project from storage:', error);
      localStorage.removeItem('currentProject');
    }

    return null;
  }

  // Clear all clients and reset
  reset() {
    this.clients.clear();
    this.currentClient = null;
    this.currentProject = null;
    localStorage.removeItem('currentProject');
  }
}

// Export singleton instance
export const dynamicSupabase = new DynamicSupabaseClient();

// Helper function to get the current client or throw error
export const getCurrentSupabaseClient = (): SupabaseClient<Database> => {
  const client = dynamicSupabase.getCurrentClient();
  if (!client) {
    throw new Error('No Supabase client initialized. Please log in first.');
  }
  return client;
};
