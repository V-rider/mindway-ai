
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { migrateStudentPasswords, migrateTeacherPasswords } from '@/lib/utils/migrate-passwords';
import { toast } from 'sonner';

export const PasswordMigration = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  // Auto-run migration on component mount
  useEffect(() => {
    if (!hasRun) {
      runMigration();
    }
  }, [hasRun]);

  const runMigration = async () => {
    setIsRunning(true);
    try {
      console.log("Starting automatic password migration process...");
      await migrateStudentPasswords();
      await migrateTeacherPasswords();
      toast.success("Password migration completed successfully!");
      setHasRun(true);
    } catch (error) {
      console.error("Migration failed:", error);
      toast.error("Password migration failed. Check console for details.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Password Migration</CardTitle>
        <CardDescription>
          Convert existing plain text passwords to secure hashed format
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRunning && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800 text-sm">Migration in progress...</p>
          </div>
        )}
        
        {hasRun && !isRunning && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800 text-sm">Migration completed successfully!</p>
          </div>
        )}
        
        <Button 
          onClick={runMigration} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? "Migrating..." : hasRun ? "Run Migration Again" : "Run Password Migration"}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          This will hash all existing passwords using the secure Edge Function.
        </p>
      </CardContent>
    </Card>
  );
};
