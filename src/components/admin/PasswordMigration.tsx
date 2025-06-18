
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { migrateStudentPasswords, migrateTeacherPasswords } from '@/lib/utils/migrate-passwords';
import { toast } from 'sonner';

export const PasswordMigration = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [migrationResults, setMigrationResults] = useState<string[]>([]);

  const runMigration = async () => {
    setIsRunning(true);
    setMigrationResults([]);
    
    try {
      console.log("Starting password migration process...");
      
      // Capture console logs for display
      const originalLog = console.log;
      const originalError = console.error;
      const logs: string[] = [];
      
      console.log = (...args) => {
        const message = args.join(' ');
        logs.push(`[INFO] ${message}`);
        originalLog(...args);
      };
      
      console.error = (...args) => {
        const message = args.join(' ');
        logs.push(`[ERROR] ${message}`);
        originalError(...args);
      };
      
      await migrateStudentPasswords();
      await migrateTeacherPasswords();
      
      // Restore console functions
      console.log = originalLog;
      console.error = originalError;
      
      setMigrationResults(logs);
      toast.success("Password migration completed! Check the logs below for details.");
      
    } catch (error) {
      console.error("Migration failed:", error);
      toast.error("Password migration failed. Check console for details.");
      setMigrationResults(prev => [...prev, `[ERROR] Migration failed: ${error}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Password Migration</CardTitle>
        <CardDescription>
          Convert existing plain text passwords to secure hashed format for all users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runMigration} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? "Migrating Passwords..." : "Run Password Migration"}
        </Button>
        
        {migrationResults.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Migration Log:</h4>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md max-h-64 overflow-y-auto">
              {migrationResults.map((log, index) => (
                <div 
                  key={index} 
                  className={`text-xs font-mono ${
                    log.includes('[ERROR]') ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground">
          This will hash all existing passwords using the secure Edge Function. 
          Teachers from CFSS will have their existing passwords properly hashed.
        </p>
      </CardContent>
    </Card>
  );
};
