
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { migrateStudentPasswords, migrateTeacherPasswords } from '@/lib/utils/migrate-passwords';
import { toast } from 'sonner';

export const PasswordMigration = () => {
  const [isRunning, setIsRunning] = useState(false);

  const runMigration = async () => {
    setIsRunning(true);
    try {
      console.log("Starting password migration process...");
      await migrateStudentPasswords();
      await migrateTeacherPasswords();
      toast.success("Password migration completed successfully!");
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
        <Button 
          onClick={runMigration} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? "Migrating..." : "Run Password Migration"}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          This will hash all existing passwords using the secure Edge Function.
        </p>
      </CardContent>
    </Card>
  );
};
