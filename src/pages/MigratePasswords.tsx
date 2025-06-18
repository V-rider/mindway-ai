
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { hashExistingPasswords } from '@/scripts/hash-existing-passwords';

const MigratePasswords = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const runMigration = async () => {
    setIsRunning(true);
    setResult(null);
    setLogs([]);

    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      const message = args.join(' ');
      setLogs(prev => [...prev, `[LOG] ${message}`]);
      originalLog(...args);
    };

    console.error = (...args) => {
      const message = args.join(' ');
      setLogs(prev => [...prev, `[ERROR] ${message}`]);
      originalError(...args);
    };

    try {
      const migrationResult = await hashExistingPasswords();
      setResult(migrationResult);
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      // Restore original console methods
      console.log = originalLog;
      console.error = originalError;
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Password Hashing Migration</CardTitle>
          <CardDescription>
            This tool will hash all existing plain text passwords in the database.
            Run this once to convert all passwords to the secure hashed format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runMigration} 
            disabled={isRunning}
            size="lg"
            className="w-full"
          >
            {isRunning ? 'Running Migration...' : 'Start Password Migration'}
          </Button>

          {result && (
            <Alert className={result.success ? 'border-green-500' : 'border-red-500'}>
              <AlertDescription>
                {result.success ? (
                  <div>
                    <strong>Migration completed successfully!</strong>
                    <br />
                    Students processed: {result.studentsProcessed}
                    <br />
                    Teachers processed: {result.teachersProcessed}
                  </div>
                ) : (
                  <div>
                    <strong>Migration failed:</strong>
                    <br />
                    {result.error?.message || 'Unknown error occurred'}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {logs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Migration Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`text-sm font-mono ${
                        log.includes('[ERROR]') ? 'text-red-600' : 'text-gray-700'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Alert>
            <AlertDescription>
              <strong>Important:</strong> This migration will only process passwords that haven't been hashed yet.
              It's safe to run multiple times. After running this migration, all new logins will automatically
              use the secure hashed password system.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default MigratePasswords;
